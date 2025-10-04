// Test połączenia z Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://euvlwzvgrjthnkdfikju.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dmx3enZncmp0aG5rZGZpa2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzMxOTQsImV4cCI6MjA3NDY0OTE5NH0.Y0C59FdDIJWKpn1kDSiL8lK6Bw0ywG-kRUL7Zjf1LA8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testuję połączenie z Supabase...')
  
  try {
    // Test 1: Pobierz wydarzenia
    console.log('📅 Pobieram wydarzenia...')
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .limit(3)
    
    if (eventsError) {
      console.error('❌ Błąd przy pobieraniu wydarzeń:', eventsError)
      return
    }
    
    console.log('✅ Wydarzenia pobrane pomyślnie:', events.length)
    if (events.length > 0) {
      console.log('📊 Przykład wydarzenia:', {
        id: events[0].id,
        name: events[0].name,
        status: events[0].status
      })
    }
    
    // Test 2: Pobierz konkurencje
    console.log('🏆 Pobieram konkurencje...')
    const { data: competitions, error: compError } = await supabase
      .from('competitions')
      .select('*')
      .limit(3)
    
    if (compError) {
      console.error('❌ Błąd przy pobieraniu konkurencji:', compError)
      return
    }
    
    console.log('✅ Konkurencje pobrane pomyślnie:', competitions.length)
    
    // Test 3: Sprawdź strukturę tabeli events
    console.log('🔍 Sprawdzam strukturę tabeli events...')
    if (events.length > 0) {
      const fields = Object.keys(events[0]).sort()
      console.log('📋 Dostępne pola:', fields)
      
      // Sprawdź czy nowe pola istnieją
      const newFields = [
        'patron_honorowy', 'organizatorzy', 'contact_person_1_name',
        'contact_person_1_title', 'contact_person_1_phone', 'contact_person_2_name',
        'contact_person_2_title', 'contact_person_2_phone', 'event_rules',
        'patronat_pdf_url', 'organizatorzy_pdf_url'
      ]
      
      const missingFields = newFields.filter(field => !fields.includes(field))
      if (missingFields.length > 0) {
        console.log('⚠️  Brakujące pola:', missingFields)
        console.log('💡 Musisz dodać te pola ręcznie w Supabase Dashboard')
      } else {
        console.log('✅ Wszystkie nowe pola są dostępne!')
      }
    }
    
    // Test 4: Sprawdź Storage
    console.log('📁 Sprawdzam Storage...')
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets()
    
    if (storageError) {
      console.error('❌ Błąd przy sprawdzaniu Storage:', storageError)
      return
    }
    
    console.log('✅ Storage dostępny, buckets:', buckets.length)
    if (buckets.length > 0) {
      console.log('📦 Dostępne buckets:', buckets.map(b => b.name))
    }
    
    console.log('🎉 Wszystkie testy zakończone pomyślnie!')
    
  } catch (error) {
    console.error('❌ Nieoczekiwany błąd:', error)
  }
}

// Uruchom test
testConnection()
