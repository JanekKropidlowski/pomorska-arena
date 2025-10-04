-- Dodaj konkurencje dla wydarzenia strzeleckiego
-- Najpierw znajdź ID wydarzenia
SELECT id, name FROM events WHERE name LIKE '%Strzelectwie%';

-- Dodaj konkurencje (zastąp EVENT_ID rzeczywistym ID wydarzenia)
-- 1. Strzelectwo - broń krótka
INSERT INTO competitions (
  event_id,
  name,
  description,
  rules,
  metric_type,
  aggregation_type,
  attempts_count,
  is_team_competition,
  team_size,
  scoring_formula,
  penalty_rules,
  sort_order
) VALUES (
  (SELECT id FROM events WHERE name LIKE '%Strzelectwie%' LIMIT 1),
  'Strzelectwo - broń krótka',
  'Każdy zawodnik oddaje 5 strzałów z broni krótkiej (pozycja stojąca, 5 metrów). Przed strzelaniem zawodnik ma 5 strzałów próbnych (nie liczą się do punktacji).',
  'Zasady: pozycja stojąca, odległość 5m, 5 strzałów próbnych + 5 strzałów punktowanych. Do klasyfikacji liczy się suma punktów z serii.',
  'points',
  'sum',
  5,
  false,
  null,
  'sum(points)',
  'Brak punktów za strzały poza celem',
  1
);

-- 2. Strzelectwo - broń długa
INSERT INTO competitions (
  event_id,
  name,
  description,
  rules,
  metric_type,
  aggregation_type,
  attempts_count,
  is_team_competition,
  team_size,
  scoring_formula,
  penalty_rules,
  sort_order
) VALUES (
  (SELECT id FROM events WHERE name LIKE '%Strzelectwie%' LIMIT 1),
  'Strzelectwo - broń długa',
  'Każdy zawodnik oddaje 5 strzałów z broni długiej (pozycja stojąca, 5 metrów). Przed strzelaniem zawodnik ma 5 strzałów próbnych (nie liczą się do punktacji).',
  'Zasady: pozycja stojąca, odległość 5m, 5 strzałów próbnych + 5 strzałów punktowanych. Do klasyfikacji liczy się suma punktów z serii.',
  'points',
  'sum',
  5,
  false,
  null,
  'sum(points)',
  'Brak punktów za strzały poza celem',
  2
);

-- 3. Bieg przełajowy
INSERT INTO competitions (
  event_id,
  name,
  description,
  rules,
  metric_type,
  aggregation_type,
  attempts_count,
  is_team_competition,
  team_size,
  scoring_formula,
  penalty_rules,
  sort_order
) VALUES (
  (SELECT id FROM events WHERE name LIKE '%Strzelectwie%' LIMIT 1),
  'Bieg przełajowy',
  'Dystans: ok. 1000 m. Prowadzona jest tylko klasyfikacja miejsc (nie ma dodatkowych punktów do sumy). Troje najlepszych dziewcząt i chłopców dostaje nagrody.',
  'Zasady: dystans 1000m, klasyfikacja miejscowa, nagrody dla top 3 dziewcząt i chłopców osobno.',
  'time',
  'best_attempt',
  1,
  false,
  null,
  'best_attempt(time)',
  'Dyskwalifikacja za skrócenie trasy',
  3
);

-- 4. Rzut granatem do celu
INSERT INTO competitions (
  event_id,
  name,
  description,
  rules,
  metric_type,
  aggregation_type,
  attempts_count,
  is_team_competition,
  team_size,
  scoring_formula,
  penalty_rules,
  sort_order
) VALUES (
  (SELECT id FROM events WHERE name LIKE '%Strzelectwie%' LIMIT 1),
  'Rzut granatem do celu',
  'Dziewczęta: rzut z 15 m, chłopcy: rzut z 20 m. Cel: trzy koła o średnicy 1 m, 2 m, 3 m. Punktacja: trafienie do środka = 3 pkt, do drugiego koła = 2 pkt, do trzeciego = 1 pkt.',
  'Zasady: dziewczęta 15m, chłopcy 20m. Cel: 3 koła (1m, 2m, 3m). 3 rzuty na zawodnika. Przy remisie: pomiar od środka koła - bliższe trafienie wygrywa.',
  'points',
  'sum',
  3,
  false,
  null,
  'sum(points) + tie_breaker_distance',
  'Brak punktów za rzuty poza celem',
  4
);

-- Sprawdź dodane konkurencje
SELECT 
  c.name,
  c.description,
  c.rules,
  c.metric_type,
  c.aggregation_type,
  c.attempts_count,
  c.sort_order
FROM competitions c
JOIN events e ON c.event_id = e.id
WHERE e.name LIKE '%Strzelectwie%'
ORDER BY c.sort_order;
