// Test nawigacji między panelami
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://euvlwzvgrjthnkdfikju.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dmx3enZncmp0aG5rZGZpa2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzMxOTQsImV4cCI6MjA3NDY0OTE5NH0.Y0C59FdDIJWKpn1kDSiL8lK6Bw0ywG-kRUL7Zjf1LA8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testNavigation() {
  console.log('🧪 Testuję nawigację między panelami...')
  
  try {
    // Test 1: Sprawdź czy użytkownik admin może uzyskać dostęp do paneli
    console.log('👤 Testuję autoryzację admin...')
    
    // Symuluj logowanie admin
    const adminUser = {
      id: '1',
      email: 'admin@lzs-pomorski.pl',
      role: 'admin',
      name: 'Administrator LZS'
    }
    
    console.log('✅ Admin user:', adminUser)
    console.log('🔑 Rola admin:', adminUser.role)
    
    // Test 2: Sprawdź logikę ProtectedRoute
    console.log('🛡️  Testuję logikę ProtectedRoute...')
    
    const testRoutes = [
      { path: '/admin', allow: ['admin'], userRole: 'admin', shouldAllow: true },
      { path: '/office', allow: ['office'], userRole: 'admin', shouldAllow: true },
      { path: '/judge', allow: ['judge'], userRole: 'admin', shouldAllow: true },
      { path: '/office', allow: ['office'], userRole: 'office', shouldAllow: true },
      { path: '/judge', allow: ['judge'], userRole: 'judge', shouldAllow: true },
      { path: '/admin', allow: ['admin'], userRole: 'office', shouldAllow: false },
      { path: '/admin', allow: ['admin'], userRole: 'judge', shouldAllow: false }
    ]
    
    testRoutes.forEach(route => {
      const role = route.userRole.toLowerCase()
      const isAdmin = role === 'admin'
      const hasAccess = isAdmin || route.allow.includes(role)
      const result = hasAccess === route.shouldAllow ? '✅' : '❌'
      
      console.log(`${result} ${route.path} (${route.userRole}) -> ${hasAccess ? 'ALLOW' : 'DENY'} (expected: ${route.shouldAllow ? 'ALLOW' : 'DENY'})`)
    })
    
    // Test 3: Sprawdź czy aplikacja odpowiada
    console.log('🌐 Testuję dostępność aplikacji...')
    
    const response = await fetch('http://localhost:8081/')
    if (response.ok) {
      console.log('✅ Aplikacja jest dostępna na http://localhost:8081/')
    } else {
      console.log('❌ Aplikacja nie odpowiada')
    }
    
    console.log('🎉 Test nawigacji zakończony!')
    console.log('')
    console.log('📋 INSTRUKCJE TESTOWANIA:')
    console.log('1. Otwórz http://localhost:8081/')
    console.log('2. Zaloguj się jako admin@lzs-pomorski.pl / admin123!')
    console.log('3. Przejdź do Panel Administratora')
    console.log('4. Kliknij "Otwórz" w sekcji "Panel Biura"')
    console.log('5. Kliknij "Otwórz" w sekcji "Panel Sędziego"')
    console.log('6. Sprawdź czy oba panele się otwierają')
    
  } catch (error) {
    console.error('❌ Błąd podczas testowania:', error)
  }
}

// Uruchom test
testNavigation()
