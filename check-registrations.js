import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hqjqjqjqjqjqjqj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxanFqcWpxanFqcWpxanFqcWpxanEiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzM0NzQ4MDAwLCJleHAiOjIwNTAzMjQwMDB9.4QH8QH8QH8QH8QH8QH8QH8QH8QH8QH8QH8QH8QH8Q'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkRegistrations() {
  try {
    console.log('🔍 Sprawdzam zgłoszenia...')
    
    // Sprawdź wszystkie zgłoszenia
    const { data: registrations, error: regError } = await supabase
      .from('registrations')
      .select(`
        *,
        teams (name, type, contact_person, contact_email),
        participants (first_name, last_name, birth_date, gender),
        age_categories (name)
      `)
      .order('registration_date', { ascending: false })

    if (regError) {
      console.error('❌ Błąd przy pobieraniu zgłoszeń:', regError)
      return
    }

    console.log(`📊 Znaleziono ${registrations.length} zgłoszeń:`)
    registrations.forEach((reg, index) => {
      console.log(`${index + 1}. ${reg.teams?.name} - ${reg.participants?.first_name} ${reg.participants?.last_name} (${reg.status})`)
    })

    // Sprawdź drużyny
    console.log('\n🔍 Sprawdzam drużyny...')
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false })

    if (teamsError) {
      console.error('❌ Błąd przy pobieraniu drużyn:', teamsError)
    } else {
      console.log(`📊 Znaleziono ${teams.length} drużyn:`)
      teams.forEach((team, index) => {
        console.log(`${index + 1}. ${team.name} (${team.type}) - ${team.contact_person}`)
      })
    }

    // Sprawdź uczestników
    console.log('\n🔍 Sprawdzam uczestników...')
    const { data: participants, error: participantsError } = await supabase
      .from('participants')
      .select('*')
      .order('created_at', { ascending: false })

    if (participantsError) {
      console.error('❌ Błąd przy pobieraniu uczestników:', participantsError)
    } else {
      console.log(`📊 Znaleziono ${participants.length} uczestników:`)
      participants.forEach((participant, index) => {
        console.log(`${index + 1}. ${participant.first_name} ${participant.last_name} (${participant.gender})`)
      })
    }

    // Sprawdź wydarzenia
    console.log('\n🔍 Sprawdzam wydarzenia...')
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: false })

    if (eventsError) {
      console.error('❌ Błąd przy pobieraniu wydarzeń:', eventsError)
    } else {
      console.log(`📊 Znaleziono ${events.length} wydarzeń:`)
      events.forEach((event, index) => {
        console.log(`${index + 1}. ${event.name} (${event.id})`)
      })
    }

  } catch (error) {
    console.error('❌ Błąd:', error)
  }
}

checkRegistrations()
