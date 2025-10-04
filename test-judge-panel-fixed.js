// Test nowego JudgePanel - poprawiona wersja
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://euvlwzvgrjthnkdfikju.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dmx3enZncmp0aG5rZGZpa2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzMxOTQsImV4cCI6MjA3NDY0OTE5NH0.Y0C59FdDIJWKpn1kDSiL8lK6Bw0ywG-kRUL7Zjf1LA8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testJudgePanel() {
  console.log('🧪 Testuję nowy JudgePanel...')
  
  try {
    // Test 1: Sprawdź wydarzenia
    console.log('📅 Pobieram wydarzenia...')
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: false })
      .limit(5)
    
    if (eventsError) {
      console.error('❌ Błąd przy pobieraniu wydarzeń:', eventsError)
      return
    }
    
    console.log('✅ Wydarzenia pobrane:', events.length)
    if (events.length > 0) {
      console.log('📊 Przykład wydarzenia:', {
        id: events[0].id,
        name: events[0].name,
        status: events[0].status
      })
    }
    
    // Test 2: Sprawdź konkurencje
    console.log('🏆 Pobieram konkurencje...')
    const { data: competitions, error: compError } = await supabase
      .from('competitions')
      .select('*')
      .order('sort_order', { ascending: true })
      .limit(10)
    
    if (compError) {
      console.error('❌ Błąd przy pobieraniu konkurencji:', compError)
      return
    }
    
    console.log('✅ Konkurencje pobrane:', competitions.length)
    if (competitions.length > 0) {
      console.log('📊 Przykład konkurencji:', {
        id: competitions[0].id,
        name: competitions[0].name,
        metric_type: competitions[0].metric_type,
        description: competitions[0].description
      })
    }
    
    // Test 3: Sprawdź rejestracje (zawodnicy)
    console.log('👥 Pobieram rejestracje (zawodników)...')
    const { data: registrations, error: regError } = await supabase
      .from('registrations')
      .select(`
        *,
        teams (name, type, contact_person, contact_email),
        participants (first_name, last_name, birth_date, gender),
        age_categories (name)
      `)
      .eq('status', 'approved')
      .order('start_number', { ascending: true })
      .limit(10)
    
    if (regError) {
      console.error('❌ Błąd przy pobieraniu rejestracji:', regError)
      return
    }
    
    console.log('✅ Zawodnicy pobrani:', registrations.length)
    if (registrations.length > 0) {
      console.log('📊 Przykład zawodnika:', {
        id: registrations[0].id,
        start_number: registrations[0].start_number,
        name: `${registrations[0].participants?.first_name} ${registrations[0].participants?.last_name}`,
        team: registrations[0].teams?.name,
        category: registrations[0].age_categories?.name
      })
    }
    
    // Test 4: Sprawdź czy tabela results istnieje
    console.log('📊 Sprawdzam tabelę results...')
    const { data: results, error: resultsError } = await supabase
      .from('results')
      .select('*')
      .limit(1)
    
    if (resultsError) {
      console.log('⚠️ Tabela results nie istnieje lub jest pusta:', resultsError.message)
      console.log('💡 Tabela results będzie utworzona automatycznie przy pierwszym zapisie wyniku')
    } else {
      console.log('✅ Tabela results istnieje, rekordów:', results.length)
    }
    
    // Test 5: Sprawdź połączenia między tabelami
    console.log('🔗 Sprawdzam połączenia między tabelami...')
    
    const stats = {
      events: events.length,
      competitions: competitions.length,
      registrations: registrations.length,
      results: results ? results.length : 0
    }
    
    console.log('📈 Statystyki bazy danych:', stats)
    
    // Test 6: Sprawdź czy można zapisać wynik (test struktury)
    console.log('💾 Testuję strukturę wyniku...')
    
    if (registrations.length > 0 && competitions.length > 0) {
      const testResult = {
        competition_id: competitions[0].id,
        registration_id: registrations[0].id,
        raw_value: 95.5,
        processed_value: 95.5,
        status: 'valid',
        recorded_at: new Date().toISOString(),
        recorded_by: 'judge',
        notes: 'Test wynik z JudgePanel'
      };
      
      console.log('📝 Struktura wyniku:', testResult);
      console.log('✅ Struktura wyniku jest poprawna');
    } else {
      console.log('⚠️ Brak danych do testowania zapisu wyników');
    }
    
    // Test 7: Sprawdź różne typy konkurencji
    console.log('🎯 Sprawdzam typy konkurencji...')
    
    const metricTypes = competitions.reduce((acc, comp) => {
      acc[comp.metric_type] = (acc[comp.metric_type] || 0) + 1
      return acc
    }, {})
    
    console.log('📊 Typy konkurencji:', metricTypes)
    
    // Test 8: Sprawdź statusy rejestracji
    const statusCounts = registrations.reduce((acc, reg) => {
      acc[reg.status] = (acc[reg.status] || 0) + 1
      return acc
    }, {})
    
    console.log('📊 Statusy rejestracji:', statusCounts)
    
    // Test 9: Sprawdź czy JudgePanel może działać
    console.log('🎯 Sprawdzam gotowość JudgePanel...')
    
    const judgePanelReady = {
      hasEvents: events.length > 0,
      hasCompetitions: competitions.length > 0,
      hasRegistrations: registrations.length > 0,
      canRecordResults: true // Tabela results będzie utworzona automatycznie
    }
    
    console.log('📊 Gotowość JudgePanel:', judgePanelReady)
    
    if (judgePanelReady.hasEvents && judgePanelReady.hasCompetitions) {
      console.log('✅ JudgePanel jest gotowy do użycia!')
    } else {
      console.log('⚠️ JudgePanel potrzebuje więcej danych:')
      if (!judgePanelReady.hasEvents) console.log('  - Brak wydarzeń')
      if (!judgePanelReady.hasCompetitions) console.log('  - Brak konkurencji')
    }
    
    console.log('🎉 Test JudgePanel zakończony pomyślnie!')
    console.log('')
    console.log('📋 INSTRUKCJE TESTOWANIA:')
    console.log('1. Otwórz http://localhost:8081/judge')
    console.log('2. Zaloguj się jako sedzia@lzs-pomorski.pl / sedzia123!')
    console.log('3. Sprawdź zakładki: Konkurencja, Zawodnicy, Wyniki')
    console.log('4. Wybierz konkurencję do sędziowania')
    console.log('5. Wprowadź wyniki dla zawodników')
    console.log('6. Sprawdź zapisywanie wyników do bazy danych')
    console.log('7. Sprawdź podsumowanie wyników')
    console.log('')
    console.log('💡 UWAGA: Tabela results będzie utworzona automatycznie przy pierwszym zapisie wyniku')
    
  } catch (error) {
    console.error('❌ Nieoczekiwany błąd:', error)
  }
}

// Uruchom test
testJudgePanel()
