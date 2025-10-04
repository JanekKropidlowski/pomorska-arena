// Skrypt do konfiguracji bazy danych Supabase
// Uruchom: node setup-database.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://euvlwzvgrjthnkdfikju.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dmx3enZncmp0aG5rZGZpa2p1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA3MzE5NCwiZXhwIjoyMDc0NjQ5MTk0fQ.bfLxkmPhTJPutN_UyRjekFMG_SklFrzpQ5a7uUta6ng";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupDatabase() {
  console.log('🚀 Rozpoczynam konfigurację bazy danych...');

  try {
    // 1. Dodaj pola do tabeli events
    console.log('📝 Dodaję pola do tabeli events...');
    
    const alterTableQuery = `
      ALTER TABLE events 
      ADD COLUMN IF NOT EXISTS patron_honorowy TEXT,
      ADD COLUMN IF NOT EXISTS organizatorzy TEXT,
      ADD COLUMN IF NOT EXISTS contact_person_1_name TEXT,
      ADD COLUMN IF NOT EXISTS contact_person_1_title TEXT,
      ADD COLUMN IF NOT EXISTS contact_person_1_phone TEXT,
      ADD COLUMN IF NOT EXISTS contact_person_2_name TEXT,
      ADD COLUMN IF NOT EXISTS contact_person_2_title TEXT,
      ADD COLUMN IF NOT EXISTS contact_person_2_phone TEXT,
      ADD COLUMN IF NOT EXISTS event_rules TEXT,
      ADD COLUMN IF NOT EXISTS patronat_pdf_url TEXT,
      ADD COLUMN IF NOT EXISTS organizatorzy_pdf_url TEXT;
    `;

    const { data, error } = await supabase.rpc('exec', { sql: alterTableQuery });
    
    if (error) {
      console.error('❌ Błąd przy dodawaniu pól:', error);
      return;
    }
    
    console.log('✅ Pola dodane pomyślnie');

    // 2. Sprawdź czy Storage bucket istnieje
    console.log('📁 Sprawdzam Storage...');
    
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Błąd przy sprawdzaniu Storage:', bucketsError);
      return;
    }

    const documentsBucket = buckets.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      console.log('📁 Tworzę bucket "documents"...');
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('documents', {
        public: true,
        allowedMimeTypes: ['application/pdf'],
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createError) {
        console.error('❌ Błąd przy tworzeniu bucket:', createError);
        return;
      }
      
      console.log('✅ Bucket "documents" utworzony');
    } else {
      console.log('✅ Bucket "documents" już istnieje');
    }

    // 3. Sprawdź aktualną strukturę tabeli events
    console.log('🔍 Sprawdzam strukturę tabeli events...');
    
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .limit(1);
    
    if (eventsError) {
      console.error('❌ Błąd przy sprawdzaniu tabeli events:', eventsError);
      return;
    }

    if (events && events.length > 0) {
      console.log('📊 Dostępne pola w tabeli events:');
      console.log(Object.keys(events[0]).sort());
    }

    console.log('🎉 Konfiguracja bazy danych zakończona pomyślnie!');

  } catch (error) {
    console.error('❌ Nieoczekiwany błąd:', error);
  }
}

// Uruchom konfigurację
setupDatabase();
