// Test nowego OfficePanel
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://euvlwzvgrjthnkdfikju.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dmx3enZncmp0aG5rZGZpa2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzMxOTQsImV4cCI6MjA3NDY0OTE5NH0.Y0C59FdDIJWKpn1kDSiL8lK6Bw0ywG-kRUL7Zjf1LA8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testOfficePanel() {
  console.log('🧪 Testuję nowy OfficePanel...')
  
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
    
    // Test 2: Sprawdź rejestracje
    console.log('👥 Pobieram rejestracje...')
    const { data: registrations, error: regError } = await supabase
      .from('registrations')
      .select(`
        *,
        teams (name, type, contact_person, contact_email),
        participants (first_name, last_name, birth_date, gender),
        age_categories (name)
      `)
      .order('registration_date', { ascending: false })
      .limit(10)
    
    if (regError) {
      console.error('❌ Błąd przy pobieraniu rejestracji:', regError)
      return
    }
    
    console.log('✅ Rejestracje pobrane:', registrations.length)
    if (registrations.length > 0) {
      console.log('📊 Przykład rejestracji:', {
        id: registrations[0].id,
        team: registrations[0].teams?.name,
        participant: `${registrations[0].participants?.first_name} ${registrations[0].participants?.last_name}`,
        status: registrations[0].status
      })
    }
    
    // Test 3: Sprawdź konkurencje
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
        metric_type: competitions[0].metric_type
      })
    }
    
    // Test 4: Sprawdź drużyny
    console.log('🏅 Pobieram drużyny...')
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (teamsError) {
      console.error('❌ Błąd przy pobieraniu drużyn:', teamsError)
      return
    }
    
    console.log('✅ Drużyny pobrane:', teams.length)
    if (teams.length > 0) {
      console.log('📊 Przykład drużyny:', {
        id: teams[0].id,
        name: teams[0].name,
        type: teams[0].type
      })
    }
    
    // Test 5: Sprawdź uczestników
    console.log('👤 Pobieram uczestników...')
    const { data: participants, error: partError } = await supabase
      .from('participants')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (partError) {
      console.error('❌ Błąd przy pobieraniu uczestników:', partError)
      return
    }
    
    console.log('✅ Uczestnicy pobrani:', participants.length)
    if (participants.length > 0) {
      console.log('📊 Przykład uczestnika:', {
        id: participants[0].id,
        name: `${participants[0].first_name} ${participants[0].last_name}`,
        gender: participants[0].gender
      })
    }
    
    // Test 6: Sprawdź połączenia między tabelami
    console.log('🔗 Sprawdzam połączenia między tabelami...')
    
    const stats = {
      events: events.length,
      registrations: registrations.length,
      competitions: competitions.length,
      teams: teams.length,
      participants: participants.length
    }
    
    console.log('📈 Statystyki bazy danych:', stats)
    
    // Sprawdź czy rejestracje mają połączone dane
    const registrationsWithData = registrations.filter(reg => 
      reg.teams && reg.participants && reg.age_categories
    )
    
    console.log(`✅ Rejestracje z pełnymi danymi: ${registrationsWithData.length}/${registrations.length}`)
    
    // Test 7: Sprawdź statusy rejestracji
    const statusCounts = registrations.reduce((acc, reg) => {
      acc[reg.status] = (acc[reg.status] || 0) + 1
      return acc
    }, {})
    
    console.log('📊 Statusy rejestracji:', statusCounts)
    
    console.log('🎉 Test OfficePanel zakończony pomyślnie!')
    console.log('')
    console.log('📋 INSTRUKCJE TESTOWANIA:')
    console.log('1. Otwórz http://localhost:8081/office')
    console.log('2. Zaloguj się jako biuro@lzs-pomorski.pl / biuro123!')
    console.log('3. Sprawdź zakładki: Rejestracje, Drużyny, Wyniki, Raporty')
    console.log('4. Sprawdź czy dane się ładują z bazy danych')
    console.log('5. Sprawdź funkcje zatwierdzania/odrzucania rejestracji')
    
  } catch (error) {
    console.error('❌ Nieoczekiwany błąd:', error)
  }
}

// Uruchom test
testOfficePanel()
