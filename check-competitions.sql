-- Sprawdź wszystkie konkurencje w bazie danych
SELECT 
  c.id,
  c.name,
  c.description,
  c.metric_type,
  c.aggregation_type,
  c.attempts_count,
  c.is_team_competition,
  c.team_size,
  c.sort_order,
  e.name as event_name
FROM competitions c
JOIN events e ON c.event_id = e.id
ORDER BY e.name, c.sort_order;

-- Sprawdź czy są konkurencje z typem "relay" lub "sztafeta"
SELECT 
  c.name,
  c.description,
  e.name as event_name
FROM competitions c
JOIN events e ON c.event_id = e.id
WHERE c.name ILIKE '%sztafeta%' 
   OR c.description ILIKE '%sztafeta%'
   OR c.name ILIKE '%relay%'
   OR c.description ILIKE '%relay%';
