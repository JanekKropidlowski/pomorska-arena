// Sprawdzenie statusu wydarzenia w bazie danych
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://euvlwzvgrjthnkdfikju.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dmx3enZncmp0aG5rZGZpa2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzMxOTQsImV4cCI6MjA3NDY0OTE5NH0.Y0C59FdDIJWKpn1kDSiL8lK6Bw0ywG-kRUL7Zjf1LA8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEvent() {
  console.log('🔍 Sprawdzam wydarzenie: II Mistrzostwa Województwa Pomorskiego Szkół Ponadpodstawowych w Strzelectwie "W Dychę" o Puchar Prezesa Pomorskiego Zrzeszenia LZS');

  try {
    // Sprawdź wydarzenia
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .ilike('name', '%Mistrzostwa Województwa Pomorskiego%');

    if (eventsError) {
      console.error('❌ Błąd przy pobieraniu wydarzeń:', eventsError);
      return;
    }

    console.log('📅 Znalezione wydarzenia:', events.length);
    if (events.length > 0) {
      console.log('✅ Wydarzenie istnieje:', {
        id: events[0].id,
        name: events[0].name,
        status: events[0].status,
        start_date: events[0].start_date,
        location: events[0].location,
        max_teams: events[0].max_teams,
        max_participants: events[0].max_participants,
        team_max_size: events[0].team_max_size,
        team_required_girls: events[0].team_required_girls,
        team_required_boys: events[0].team_required_boys
      });
    } else {
      console.log('❌ Wydarzenie nie istnieje w bazie danych');
    }

    // Sprawdź konkurencje
    if (events.length > 0) {
      const eventId = events[0].id;
      const { data: competitions, error: compError } = await supabase
        .from('competitions')
        .select('*')
        .eq('event_id', eventId);

      if (compError) {
        console.error('❌ Błąd przy pobieraniu konkurencji:', compError);
      } else {
        console.log('🏆 Konkurencje:', competitions.length);
        competitions.forEach(comp => {
          console.log('  -', comp.name, '(metric_type:', comp.metric_type + ')');
        });
      }
    }

    // Sprawdź kategorie wiekowe
    const { data: categories, error: catError } = await supabase
      .from('age_categories')
      .select('*');

    if (catError) {
      console.error('❌ Błąd przy pobieraniu kategorii:', catError);
    } else {
      console.log('👥 Kategorie wiekowe:', categories.length);
      categories.forEach(cat => {
        console.log('  -', cat.name, '(min:', cat.min_age, 'max:', cat.max_age, 'gender:', cat.gender + ')');
      });
    }

    // Sprawdź zgłoszenia
    const { data: registrations, error: regError } = await supabase
      .from('registrations')
      .select('*');

    if (regError) {
      console.error('❌ Błąd przy pobieraniu zgłoszeń:', regError);
    } else {
      console.log('📋 Zgłoszenia:', registrations.length);
    }

    // Sprawdź drużyny
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*');

    if (teamsError) {
      console.error('❌ Błąd przy pobieraniu drużyn:', teamsError);
    } else {
      console.log('🏅 Drużyny:', teams.length);
    }

    // Sprawdź uczestników
    const { data: participants, error: partError } = await supabase
      .from('participants')
      .select('*');

    if (partError) {
      console.error('❌ Błąd przy pobieraniu uczestników:', partError);
    } else {
      console.log('👤 Uczestnicy:', participants.length);
    }

  } catch (error) {
    console.error('❌ Nieoczekiwany błąd:', error);
  }
}

checkEvent();
