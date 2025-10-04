-- =============================================
-- KONFIGURACJA BAZY DANYCH DLA SYSTEMU LZS
-- =============================================

-- 1. DODAJ KONKURENCJE DLA WYDARZENIA
-- =============================================
INSERT INTO competitions (event_id, name, description, metric_type, sort_order, rules) VALUES
('577ae51c-56f9-4947-86d6-538356fd5b39', 
 'Strzelectwo', 
 '5 strzałów z broni krótkiej + 5 strzałów z broni długiej (pozycja stojąca, 5m). Suma punktów z obu serii.', 
 'points', 
 1,
 'Każdy zawodnik oddaje 5 strzałów z broni krótkiej i 5 strzałów z broni długiej. Przed strzelaniem 5 strzałów próbnych. Do klasyfikacji liczy się suma punktów z obu serii.'),

('577ae51c-56f9-4947-86d6-538356fd5b39', 
 'Bieg przełajowy', 
 'Dystans ok. 1000m. Klasyfikacja miejsc bez dodatkowych punktów do sumy.', 
 'time', 
 2,
 'Dystans: ok. 1000m. Prowadzona jest tylko klasyfikacja miejsc (nie ma dodatkowych punktów do sumy). Troje najlepszych dziewcząt i chłopców dostaje nagrody.'),

('577ae51c-56f9-4947-86d6-538356fd5b39', 
 'Rzut granatem do celu', 
 'Dziewczęta: 15m, chłopcy: 20m. Cel: 3 koła (1m, 2m, 3m). 3 rzuty na zawodnika.', 
 'points', 
 3,
 'Dziewczęta: rzut z 15m, chłopcy: rzut z 20m. Cel: trzy koła o średnicy 1m, 2m, 3m. Punktacja: trafienie do środka = 3 pkt, do drugiego koła = 2 pkt, do trzeciego = 1 pkt. Każdy uczestnik wykonuje 3 rzuty. Przy remisie: decyduje pomiar od środka koła – bliższe trafienie wygrywa.');

-- 2. DODAJ KATEGORIE WIEKOWE
-- =============================================
INSERT INTO age_categories (event_id, name, min_age, max_age, gender, description) VALUES
('577ae51c-56f9-4947-86d6-538356fd5b39', 
 'Dziewczęta U-16', 
 NULL, 
 16, 
 'female',
 'Kategoria dla dziewcząt do 16 roku życia'),

('577ae51c-56f9-4947-86d6-538356fd5b39', 
 'Chłopcy U-18', 
 NULL, 
 18, 
 'male',
 'Kategoria dla chłopców do 18 roku życia');

-- 3. ZAKTUALIZUJ USTAWIENIA WYDARZENIA
-- =============================================
UPDATE events SET 
  team_max_size = 6,
  team_required_girls = 3,
  team_required_boys = 3,
  patron_honorowy = 'Pomorski Kurator Oświaty',
  organizatorzy = 'Pomorskie Zrzeszenie LZS' || E'\n' || 'Współorganizator: Powiatowy Zespół Szkół w Kłaninie',
  contact_person_1_name = 'Wiesław Oberzig',
  contact_person_1_title = 'Wiceprezes PZ LZS, nauczyciel PZS w Kłaninie',
  contact_person_1_phone = '608-341-880',
  contact_person_2_name = 'Jan Trofimowicz',
  contact_person_2_title = 'Wiceprezes PZ LZS, nauczyciel w PZKZiU w Pucku',
  contact_person_2_phone = '508-738-161',
  event_rules = 'Szkołę reprezentuje 6 uczniów: 3 dziewczęta i 3 chłopców. Każdy uczestnik musi posiadać legitymację szkolną. Udział ucznia spoza szkoły skutkuje dyskwalifikacją całej drużyny. Zgłoszenia wysyła się mailem na: esio13@poczta.onet.pl. Brak wpisowego. Transport pokrywa szkoła/samorząd. Wymagane oświadczenia zdrowotne w dniu zawodów. Strój sportowy obowiązkowy. Organizator zapewnia ubezpieczenie NNW.'
WHERE id = '577ae51c-56f9-4947-86d6-538356fd5b39';

-- 4. SPRAWDŹ CZY WSZYSTKO ZOSTAŁO DODANE
-- =============================================
-- Sprawdź wydarzenie
SELECT 
  id, 
  name, 
  status, 
  start_date, 
  location,
  team_max_size,
  team_required_girls,
  team_required_boys,
  patron_honorowy,
  organizatorzy
FROM events 
WHERE id = '577ae51c-56f9-4947-86d6-538356fd5b39';

-- Sprawdź konkurencje
SELECT 
  id, 
  name, 
  metric_type, 
  sort_order
FROM competitions 
WHERE event_id = '577ae51c-56f9-4947-86d6-538356fd5b39'
ORDER BY sort_order;

-- Sprawdź kategorie wiekowe
SELECT 
  id, 
  name, 
  min_age, 
  max_age, 
  gender
FROM age_categories 
WHERE event_id = '577ae51c-56f9-4947-86d6-538356fd5b39'
ORDER BY gender, max_age;

-- Sprawdź czy tabele są gotowe do rejestracji
SELECT 
  (SELECT COUNT(*) FROM events WHERE status = 'published') as events_count,
  (SELECT COUNT(*) FROM competitions) as competitions_count,
  (SELECT COUNT(*) FROM age_categories) as age_categories_count,
  (SELECT COUNT(*) FROM teams) as teams_count,
  (SELECT COUNT(*) FROM participants) as participants_count,
  (SELECT COUNT(*) FROM registrations) as registrations_count;
