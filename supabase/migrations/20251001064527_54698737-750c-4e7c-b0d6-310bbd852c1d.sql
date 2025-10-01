-- Create comprehensive sports competition management system

-- Event types enum
CREATE TYPE public.event_type AS ENUM ('shooting', 'seniors', 'active_village', 'other');

-- Competition metric types
CREATE TYPE public.metric_type AS ENUM ('time', 'points', 'distance', 'count', 'accuracy');

-- Competition aggregation types
CREATE TYPE public.aggregation_type AS ENUM ('best_attempt', 'sum', 'average', 'top_n', 'drop_worst');

-- Registration status
CREATE TYPE public.registration_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- Result status
CREATE TYPE public.result_status AS ENUM ('valid', 'dns', 'dq', 'dnf');

-- Gender enum
CREATE TYPE public.gender AS ENUM ('male', 'female', 'mixed');

-- Events table
CREATE TABLE public.events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    registration_deadline DATE,
    event_type event_type NOT NULL,
    is_cyclic BOOLEAN DEFAULT false,
    cyclic_month INTEGER CHECK (cyclic_month >= 1 AND cyclic_month <= 12),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'active', 'completed', 'cancelled')),
    regulations_pdf_url TEXT,
    logo_url TEXT,
    max_participants INTEGER,
    max_teams INTEGER,
    organizer TEXT DEFAULT 'LZS Pomorski',
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Age categories table
CREATE TABLE public.age_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    min_age INTEGER,
    max_age INTEGER,
    gender gender NOT NULL DEFAULT 'mixed',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Competitions table
CREATE TABLE public.competitions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    rules TEXT,
    metric_type metric_type NOT NULL,
    aggregation_type aggregation_type NOT NULL,
    attempts_count INTEGER DEFAULT 1,
    is_team_competition BOOLEAN DEFAULT false,
    team_size INTEGER DEFAULT 1,
    scoring_formula TEXT, -- JSON string for complex scoring
    penalty_rules TEXT, -- JSON string for penalty configuration  
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Competition categories (linking competitions with age categories)
CREATE TABLE public.competition_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    age_category_id UUID NOT NULL REFERENCES public.age_categories(id) ON DELETE CASCADE,
    UNIQUE(competition_id, age_category_id)
);

-- Teams/Organizations table
CREATE TABLE public.teams (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('school', 'club', 'region', 'province')),
    address TEXT,
    contact_person TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Participants table
CREATE TABLE public.participants (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    gender gender NOT NULL,
    team_id UUID REFERENCES public.teams(id),
    id_number TEXT, -- student ID, personal ID, etc.
    medical_clearance BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Event registrations table
CREATE TABLE public.registrations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
    age_category_id UUID NOT NULL REFERENCES public.age_categories(id) ON DELETE CASCADE,
    status registration_status DEFAULT 'pending',
    registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by TEXT,
    notes TEXT,
    start_number INTEGER,
    UNIQUE(event_id, participant_id)
);

-- Results table
CREATE TABLE public.results (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
    competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    attempt_number INTEGER DEFAULT 1,
    raw_value DECIMAL,
    processed_value DECIMAL, -- after penalties, conversions, etc.
    time_value INTERVAL, -- for time-based competitions
    status result_status DEFAULT 'valid',
    notes TEXT,
    recorded_by TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(registration_id, competition_id, attempt_number)
);

-- Team results (for team competitions)
CREATE TABLE public.team_results (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    age_category_id UUID NOT NULL REFERENCES public.age_categories(id) ON DELETE CASCADE,
    total_score DECIMAL NOT NULL DEFAULT 0,
    position INTEGER,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(event_id, competition_id, team_id, age_category_id)
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.age_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_results ENABLE ROW LEVEL SECURITY;

-- Create public read policies for public views
CREATE POLICY "Events are publicly readable" ON public.events FOR SELECT USING (true);
CREATE POLICY "Age categories are publicly readable" ON public.age_categories FOR SELECT USING (true);
CREATE POLICY "Competitions are publicly readable" ON public.competitions FOR SELECT USING (true);
CREATE POLICY "Competition categories are publicly readable" ON public.competition_categories FOR SELECT USING (true);
CREATE POLICY "Teams are publicly readable" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Participants are publicly readable" ON public.participants FOR SELECT USING (true);
CREATE POLICY "Registrations are publicly readable" ON public.registrations FOR SELECT USING (true);
CREATE POLICY "Results are publicly readable" ON public.results FOR SELECT USING (true);
CREATE POLICY "Team results are publicly readable" ON public.team_results FOR SELECT USING (true);

-- Create admin-only write policies (will be updated once auth is implemented)
CREATE POLICY "Only admins can modify events" ON public.events FOR ALL USING (true);
CREATE POLICY "Only admins can modify age categories" ON public.age_categories FOR ALL USING (true);
CREATE POLICY "Only admins can modify competitions" ON public.competitions FOR ALL USING (true);
CREATE POLICY "Only admins can modify competition categories" ON public.competition_categories FOR ALL USING (true);
CREATE POLICY "Anyone can register teams" ON public.teams FOR ALL USING (true);
CREATE POLICY "Anyone can register participants" ON public.participants FOR ALL USING (true);
CREATE POLICY "Anyone can create registrations" ON public.registrations FOR ALL USING (true);
CREATE POLICY "Judges can record results" ON public.results FOR ALL USING (true);
CREATE POLICY "System can calculate team results" ON public.team_results FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX idx_events_date ON public.events(start_date);
CREATE INDEX idx_events_type ON public.events(event_type);
CREATE INDEX idx_registrations_event ON public.registrations(event_id);
CREATE INDEX idx_registrations_team ON public.registrations(team_id);
CREATE INDEX idx_results_registration ON public.results(registration_id);
CREATE INDEX idx_results_competition ON public.results(competition_id);
CREATE INDEX idx_team_results_event ON public.team_results(event_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_competitions_updated_at
    BEFORE UPDATE ON public.competitions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON public.teams
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_participants_updated_at
    BEFORE UPDATE ON public.participants
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();