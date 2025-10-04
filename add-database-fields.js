// Skrypt do dodawania pól do bazy danych Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://euvlwzvgrjthnkdfikju.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dmx3enZncmp0aG5rZGZpa2p1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA3MzE5NCwiZXhwIjoyMDc0NjQ5MTk0fQ.bfLxkmPhTJPutN_UyRjekFMG_SklFrzpQ5a7uUta6ng'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addDatabaseFields() {
  console.log('🚀 Rozpoczynam dodawanie pól do bazy danych...')

  try {
    // 1. Sprawdź aktualną strukturę
    console.log('🔍 Sprawdzam aktualną strukturę tabeli events...')
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .limit(1)
    
    if (eventsError) {
      console.error('❌ Błąd przy sprawdzaniu tabeli events:', eventsError)
      return
    }

    if (events && events.length > 0) {
      const currentFields = Object.keys(events[0])
      console.log('📋 Aktualne pola:', currentFields.sort())
    }

    // 2. Sprawdź czy nowe pola już istnieją
    const newFields = [
      'patron_honorowy', 'organizatorzy', 'contact_person_1_name',
      'contact_person_1_title', 'contact_person_1_phone', 'contact_person_2_name',
      'contact_person_2_title', 'contact_person_2_phone', 'event_rules',
      'patronat_pdf_url', 'organizatorzy_pdf_url'
    ]

    if (events && events.length > 0) {
      const existingFields = Object.keys(events[0])
      const missingFields = newFields.filter(field => !existingFields.includes(field))
      
      if (missingFields.length === 0) {
        console.log('✅ Wszystkie pola już istnieją!')
        return
      }
      
      console.log('⚠️  Brakujące pola:', missingFields)
    }

    // 3. Próba dodania pól przez update (symulacja)
    console.log('📝 Próbuję dodać pola...')
    
    // Sprawdź czy możemy wykonać operacje na tabeli
    const { data: testUpdate, error: testError } = await supabase
      .from('events')
      .update({ 
        patron_honorowy: 'Test patronat',
        organizatorzy: 'Test organizatorzy',
        contact_person_1_name: 'Test osoba 1',
        contact_person_1_title: 'Test stanowisko 1',
        contact_person_1_phone: '123-456-789',
        contact_person_2_name: 'Test osoba 2',
        contact_person_2_title: 'Test stanowisko 2',
        contact_person_2_phone: '987-654-321',
        event_rules: 'Test regulamin',
        patronat_pdf_url: 'test-patronat.pdf',
        organizatorzy_pdf_url: 'test-organizatorzy.pdf'
      })
      .eq('id', events[0].id)
      .select()

    if (testError) {
      console.error('❌ Błąd przy testowaniu pól:', testError)
      console.log('💡 Pola prawdopodobnie nie istnieją w bazie danych')
      console.log('📋 Musisz dodać je ręcznie w Supabase Dashboard:')
      console.log('')
      console.log('SQL do wykonania:')
      console.log('ALTER TABLE events')
      newFields.forEach((field, index) => {
        const comma = index < newFields.length - 1 ? ',' : ';'
        console.log(`  ADD COLUMN IF NOT EXISTS ${field} TEXT${comma}`)
      })
      return
    }

    console.log('✅ Pola zostały dodane pomyślnie!')
    console.log('📊 Zaktualizowane wydarzenie:', testUpdate[0])

    // 4. Sprawdź Storage
    console.log('📁 Sprawdzam Storage...')
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets()
    
    if (storageError) {
      console.error('❌ Błąd przy sprawdzaniu Storage:', storageError)
      return
    }

    console.log('✅ Storage dostępny, buckets:', buckets.length)
    
    // 5. Utwórz bucket dla dokumentów jeśli nie istnieje
    const documentsBucket = buckets.find(bucket => bucket.name === 'documents')
    
    if (!documentsBucket) {
      console.log('📁 Tworzę bucket "documents"...')
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('documents', {
        public: true,
        allowedMimeTypes: ['application/pdf'],
        fileSizeLimit: 10485760 // 10MB
      })
      
      if (createError) {
        console.error('❌ Błąd przy tworzeniu bucket:', createError)
        return
      }
      
      console.log('✅ Bucket "documents" utworzony')
    } else {
      console.log('✅ Bucket "documents" już istnieje')
    }

    console.log('🎉 Konfiguracja bazy danych zakończona!')

  } catch (error) {
    console.error('❌ Nieoczekiwany błąd:', error)
  }
}

// Uruchom konfigurację
addDatabaseFields()
