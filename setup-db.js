// Konfiguracja bazy danych dla systemu LZS
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://euvlwzvgrjthnkdfikju.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dmx3enZncmp0aG5rZGZpa2p1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA3MzE5NCwiZXhwIjoyMDc0NjQ5MTk0fQ.bfLxkmPhTJPutN_UyRjekFMG_SklFrzpQ5a7uUta6ng';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🔧 Konfiguruję bazę danych...');
  
  try {
    // 1. Dodaj konkurencje
    console.log('📊 Dodaję konkurencje...');
    const { data: competitions, error: compError } = await supabase
      .from('competitions')
      .insert([
        {
          event_id: '577ae51c-56f9-4947-86d6-538356fd5b39',
          name: 'Strzelectwo',
          description: '5 strzałów z broni krótkiej + 5 strzałów z broni długiej (pozycja stojąca, 5m). Suma punktów z obu serii.',
          metric_type: 'points',
          sort_order: 1,
          rules: 'Każdy zawodnik oddaje 5 strzałów z broni krótkiej i 5 strzałów z broni długiej. Przed strzelaniem 5 strzałów próbnych. Do klasyfikacji liczy się suma punktów z obu serii.'
        },
        {
          event_id: '577ae51c-56f9-4947-86d6-538356fd5b39',
          name: 'Bieg przełajowy',
          description: 'Dystans ok. 1000m. Klasyfikacja miejsc bez dodatkowych punktów do sumy.',
          metric_type: 'time',
          sort_order: 2,
          rules: 'Dystans: ok. 1000m. Prowadzona jest tylko klasyfikacja miejsc (nie ma dodatkowych punktów do sumy). Troje najlepszych dziewcząt i chłopców dostaje nagrody.'
        },
        {
          event_id: '577ae51c-56f9-4947-86d6-538356fd5b39',
          name: 'Rzut granatem do celu',
          description: 'Dziewczęta: 15m, chłopcy: 20m. Cel: 3 koła (1m, 2m, 3m). 3 rzuty na zawodnika.',
          metric_type: 'points',
          sort_order: 3,
          rules: 'Dziewczęta: rzut z 15m, chłopcy: rzut z 20m. Cel: trzy koła o średnicy 1m, 2m, 3m. Punktacja: trafienie do środka = 3 pkt, do drugiego koła = 2 pkt, do trzeciego = 1 pkt. Każdy uczestnik wykonuje 3 rzuty. Przy remisie: decyduje pomiar od środka koła – bliższe trafienie wygrywa.'
        }
      ])
      .select();

    if (compError) {
      console.error('❌ Błąd przy dodawaniu konkurencji:', compError);
    } else {
      console.log('✅ Dodano konkurencje:', competitions.length);
    }

    // 2. Dodaj kategorie wiekowe
    console.log('👥 Dodaję kategorie wiekowe...');
    const { data: categories, error: catError } = await supabase
      .from('age_categories')
      .insert([
        {
          event_id: '577ae51c-56f9-4947-86d6-538356fd5b39',
          name: 'Dziewczęta U-16',
          min_age: null,
          max_age: 16,
          gender: 'female',
          description: 'Kategoria dla dziewcząt do 16 roku życia'
        },
        {
          event_id: '577ae51c-56f9-4947-86d6-538356fd5b39',
          name: 'Chłopcy U-18',
          min_age: null,
          max_age: 18,
          gender: 'male',
          description: 'Kategoria dla chłopców do 18 roku życia'
        }
      ])
      .select();

    if (catError) {
      console.error('❌ Błąd przy dodawaniu kategorii:', catError);
    } else {
      console.log('✅ Dodano kategorie wiekowe:', categories.length);
    }

    // 3. Zaktualizuj ustawienia wydarzenia
    console.log('⚙️ Aktualizuję ustawienia wydarzenia...');
    const { error: updateError } = await supabase
      .from('events')
      .update({
        team_max_size: 6,
        team_required_girls: 3,
        team_required_boys: 3,
        patron_honorowy: 'Pomorski Kurator Oświaty',
        organizatorzy: 'Pomorskie Zrzeszenie LZS\nWspółorganizator: Powiatowy Zespół Szkół w Kłaninie',
        contact_person_1_name: 'Wiesław Oberzig',
        contact_person_1_title: 'Wiceprezes PZ LZS, nauczyciel PZS w Kłaninie',
        contact_person_1_phone: '608-341-880',
        contact_person_2_name: 'Jan Trofimowicz',
        contact_person_2_title: 'Wiceprezes PZ LZS, nauczyciel w PZKZiU w Pucku',
        contact_person_2_phone: '508-738-161',
        event_rules: 'Szkołę reprezentuje 6 uczniów: 3 dziewczęta i 3 chłopców. Każdy uczestnik musi posiadać legitymację szkolną. Udział ucznia spoza szkoły skutkuje dyskwalifikacją całej drużyny. Zgłoszenia wysyła się mailem na: esio13@poczta.onet.pl. Brak wpisowego. Transport pokrywa szkoła/samorząd. Wymagane oświadczenia zdrowotne w dniu zawodów. Strój sportowy obowiązkowy. Organizator zapewnia ubezpieczenie NNW.'
      })
      .eq('id', '577ae51c-56f9-4947-86d6-538356fd5b39');

    if (updateError) {
      console.error('❌ Błąd przy aktualizacji wydarzenia:', updateError);
    } else {
      console.log('✅ Zaktualizowano ustawienia wydarzenia');
    }

    // 4. Sprawdź status
    console.log('\n📊 SPRAWDZENIE STATUSU:');
    
    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', '577ae51c-56f9-4947-86d6-538356fd5b39')
      .single();
    
    const { data: comps } = await supabase
      .from('competitions')
      .select('*')
      .eq('event_id', '577ae51c-56f9-4947-86d6-538356fd5b39');
    
    const { data: cats } = await supabase
      .from('age_categories')
      .select('*')
      .eq('event_id', '577ae51c-56f9-4947-86d6-538356fd5b39');

    console.log('✅ Wydarzenie:', event?.name);
    console.log('✅ Konkurencje:', comps?.length || 0);
    console.log('✅ Kategorie wiekowe:', cats?.length || 0);
    console.log('✅ Skład drużyny:', event?.team_max_size + ' osób (' + event?.team_required_girls + ' dziewcząt, ' + event?.team_required_boys + ' chłopców)');
    
    console.log('\n🎉 BAZA DANYCH GOTOWA DO PRODUKCJI!');
    
  } catch (error) {
    console.error('❌ Nieoczekiwany błąd:', error);
  }
}

setupDatabase();
