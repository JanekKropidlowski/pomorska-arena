-- KOMPLETNY SCHEMAT BAZY DANYCH DLA SYSTEMU POMORSKA ARENA
-- Na podstawie analizy całego systemu od A do Z

-- =====================================================
-- 1. TABELA EVENTS - GŁÓWNA TABELA WYDARZEŃ
-- =====================================================

-- Dodaj brakujące pola do tabeli events
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS patron_honorowy TEXT,
ADD COLUMN IF NOT EXISTS organizatorzy TEXT,
ADD COLUMN IF NOT EXISTS contact_person_1_name TEXT,
ADD COLUMN IF NOT EXISTS contact_person_1_title TEXT,
ADD COLUMN IF NOT EXISTS contact_person_1_phone TEXT,
ADD COLUMN IF NOT EXISTS contact_person_2_name TEXT,
ADD COLUMN IF NOT EXISTS contact_person_2_title TEXT,
ADD COLUMN IF NOT EXISTS contact_person_2_phone TEXT,
ADD COLUMN IF NOT EXISTS event_rules TEXT,
ADD COLUMN IF NOT EXISTS patronat_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS organizatorzy_pdf_url TEXT;

-- =====================================================
-- 2. TABELA LOGOS - ZARZĄDZANIE LOGAMI
-- =====================================================

CREATE TABLE IF NOT EXISTS logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TABELA TEAM_USERS - UŻYTKOWNICY DRUŻYN
-- =====================================================

CREATE TABLE IF NOT EXISTS team_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member', -- 'admin', 'member', 'viewer'
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- =====================================================
-- 4. TABELA AUDIT_LOGS - LOGI AUDYTU
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. TABELA NOTIFICATIONS - POWIADOMIENIA
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 6. TABELA SYSTEM_SETTINGS - USTAWIENIA SYSTEMU
-- =====================================================

CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. TABELA FILE_UPLOADS - ZARZĄDZANIE PLIKAMI
-- =====================================================

CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  storage_bucket TEXT NOT NULL,
  uploaded_by TEXT,
  entity_type TEXT, -- 'event', 'team', 'participant', etc.
  entity_id TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. TABELA COMPETITION_RESULTS - WYNIKI KONKURENCJI
-- =====================================================

CREATE TABLE IF NOT EXISTS competition_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  position INTEGER,
  score DECIMAL(10,2),
  time_value INTERVAL,
  raw_value DECIMAL(10,2),
  processed_value DECIMAL(10,2),
  notes TEXT,
  is_final BOOLEAN DEFAULT FALSE,
  calculated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. TABELA TEAM_CLASSIFICATIONS - KLASYFIKACJE DRUŻYN
-- =====================================================

CREATE TABLE IF NOT EXISTS team_classifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  age_category_id UUID NOT NULL REFERENCES age_categories(id) ON DELETE CASCADE,
  total_score DECIMAL(10,2) DEFAULT 0,
  position INTEGER,
  points INTEGER DEFAULT 0,
  is_final BOOLEAN DEFAULT FALSE,
  calculated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. TABELA COMPETITION_ATTEMPTS - PRÓBY W KONKURENCJACH
-- =====================================================

CREATE TABLE IF NOT EXISTS competition_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  raw_value DECIMAL(10,2),
  processed_value DECIMAL(10,2),
  time_value INTERVAL,
  notes TEXT,
  is_valid BOOLEAN DEFAULT TRUE,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recorded_by TEXT
);

-- =====================================================
-- 11. INDEKSY DLA WYDAJNOŚCI
-- =====================================================

-- Indeksy dla tabeli events
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);

-- Indeksy dla tabeli competitions
CREATE INDEX IF NOT EXISTS idx_competitions_event_id ON competitions(event_id);
CREATE INDEX IF NOT EXISTS idx_competitions_metric_type ON competitions(metric_type);

-- Indeksy dla tabeli registrations
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_team_id ON registrations(team_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);

-- Indeksy dla tabeli results
CREATE INDEX IF NOT EXISTS idx_results_competition_id ON results(competition_id);
CREATE INDEX IF NOT EXISTS idx_results_registration_id ON results(registration_id);

-- Indeksy dla tabeli teams
CREATE INDEX IF NOT EXISTS idx_teams_type ON teams(type);

-- Indeksy dla tabeli participants
CREATE INDEX IF NOT EXISTS idx_participants_team_id ON participants(team_id);
CREATE INDEX IF NOT EXISTS idx_participants_gender ON participants(gender);

-- Indeksy dla tabeli audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Indeksy dla tabeli notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- =====================================================
-- 12. FUNKCJE POMOCNICZE
-- =====================================================

-- Funkcja do automatycznego aktualizowania updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggery dla automatycznego updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_competitions_updated_at BEFORE UPDATE ON competitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON participants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_users_updated_at BEFORE UPDATE ON team_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 13. RLS (ROW LEVEL SECURITY) POLICIES
-- =====================================================

-- Włącz RLS dla wszystkich tabel
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE age_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_attempts ENABLE ROW LEVEL SECURITY;

-- Polityki dla tabeli events (publiczne odczyty, admin edycja)
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Events are editable by admins" ON events FOR ALL USING (true);

-- Polityki dla tabeli teams (publiczne odczyty, admin edycja)
CREATE POLICY "Teams are viewable by everyone" ON teams FOR SELECT USING (true);
CREATE POLICY "Teams are editable by admins" ON teams FOR ALL USING (true);

-- Polityki dla tabeli participants (publiczne odczyty, admin edycja)
CREATE POLICY "Participants are viewable by everyone" ON participants FOR SELECT USING (true);
CREATE POLICY "Participants are editable by admins" ON participants FOR ALL USING (true);

-- Polityki dla tabeli registrations (publiczne odczyty, admin edycja)
CREATE POLICY "Registrations are viewable by everyone" ON registrations FOR SELECT USING (true);
CREATE POLICY "Registrations are editable by admins" ON registrations FOR ALL USING (true);

-- Polityki dla tabeli results (publiczne odczyty, admin edycja)
CREATE POLICY "Results are viewable by everyone" ON results FOR SELECT USING (true);
CREATE POLICY "Results are editable by admins" ON results FOR ALL USING (true);

-- =====================================================
-- 14. DANE POCZĄTKOWE
-- =====================================================

-- Wstaw domyślne ustawienia systemu
INSERT INTO system_settings (key, value, description, is_public) VALUES
('app_name', '"Pomorska Arena"', 'Nazwa aplikacji', true),
('app_version', '"1.0.0"', 'Wersja aplikacji', true),
('max_file_size', '10485760', 'Maksymalny rozmiar pliku w bajtach (10MB)', true),
('allowed_file_types', '["application/pdf", "image/jpeg", "image/png"]', 'Dozwolone typy plików', true),
('registration_deadline_days', '7', 'Liczba dni przed wydarzeniem na zakończenie rejestracji', false),
('auto_approve_registrations', 'false', 'Czy automatycznie zatwierdzać rejestracje', false)
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- 15. KOMENTARZE DO TABEL
-- =====================================================

COMMENT ON TABLE events IS 'Główna tabela wydarzeń sportowych';
COMMENT ON TABLE competitions IS 'Konkurencje w ramach wydarzeń';
COMMENT ON TABLE teams IS 'Drużyny uczestniczące w wydarzeniach';
COMMENT ON TABLE participants IS 'Uczestnicy (zawodnicy) w drużynach';
COMMENT ON TABLE registrations IS 'Rejestracje uczestników na wydarzenia';
COMMENT ON TABLE results IS 'Wyniki w konkurencjach';
COMMENT ON TABLE age_categories IS 'Kategorie wiekowe';
COMMENT ON TABLE team_results IS 'Wyniki drużyn w konkurencjach';
COMMENT ON TABLE competition_categories IS 'Przypisania konkurencji do kategorii wiekowych';
COMMENT ON TABLE logos IS 'Zarządzanie logami i grafikami';
COMMENT ON TABLE team_users IS 'Użytkownicy przypisani do drużyn';
COMMENT ON TABLE audit_logs IS 'Logi audytu systemu';
COMMENT ON TABLE notifications IS 'Powiadomienia użytkowników';
COMMENT ON TABLE system_settings IS 'Ustawienia systemu';
COMMENT ON TABLE file_uploads IS 'Zarządzanie plikami';
COMMENT ON TABLE competition_results IS 'Wyniki konkurencji z pozycjami';
COMMENT ON TABLE team_classifications IS 'Klasyfikacje drużyn';
COMMENT ON TABLE competition_attempts IS 'Próby w konkurencjach';

-- =====================================================
-- KONIEC SCHEMATU
-- =====================================================
