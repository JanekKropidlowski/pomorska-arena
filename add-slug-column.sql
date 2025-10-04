-- Dodaj kolumnę slug do tabeli events
ALTER TABLE events ADD COLUMN IF NOT EXISTS slug TEXT;

-- Utworz unikatowy indeks na kolumnie slug
CREATE UNIQUE INDEX IF NOT EXISTS events_slug_key ON events (slug);

-- Wygeneruj slugi dla istniejących wydarzeń
-- Przykładowe zapytanie do aktualizacji pierwszego wydarzenia:
UPDATE events 
SET slug = 'ii-mistrzostwa-wojewodztwa-pomorskiego-szkol-ponadpodstawowych-w-strzelectwie-w-dyche'
WHERE name = 'II Mistrzostwa Województwa Pomorskiego Szkół Ponadpodstawowych w Strzelectwie "W Dychę" o Puchar Prezesa Pomorskiego Zrzeszenia LZS';

-- Możesz również użyć tego zapytania aby sprawdzić obecne wydarzenia:
-- SELECT id, name FROM events;

-- A następnie zaktualizować slug dla każdego wydarzenia ręcznie lub automatycznie:
-- UPDATE events SET slug = 'nazwa-slug' WHERE id = 'id-wydarzenia';

