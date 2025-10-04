import { supabase } from "@/integrations/supabase/client";

export const AUTO_CREATE_USERS = [
  {
    email: 'admin@lzs-pomorski.pl',
    password: 'admin123!',
    role: 'admin',
    name: 'Administrator LZS'
  },
  {
    email: 'biuro@lzs-pomorski.pl', 
    password: 'biuro123!',
    role: 'office',
    name: 'Biuro LZS'
  },
  {
    email: 'sedzia@lzs-pomorski.pl',
    password: 'sedzia123!',
    role: 'judge', 
    name: 'Sędzia LZS'
  }
];

export async function autoCreateUsers() {
  const results = [];
  
  for (const user of AUTO_CREATE_USERS) {
    try {
      // Sprawdź czy użytkownik już istnieje
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(user.email);
      
      if (existingUser.user) {
        console.log(`Użytkownik ${user.email} już istnieje`);
        results.push({ email: user.email, status: 'exists', message: 'Już istnieje' });
        continue;
      }

      // Utwórz nowego użytkownika
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          role: user.role,
          name: user.name
        }
      });

      if (error) {
        console.error(`Błąd tworzenia ${user.email}:`, error);
        results.push({ email: user.email, status: 'error', message: error.message });
      } else {
        console.log(`Utworzono użytkownika: ${user.email}`);
        results.push({ email: user.email, status: 'created', message: 'Utworzono pomyślnie' });
      }
    } catch (error) {
      console.error(`Błąd dla ${user.email}:`, error);
      results.push({ email: user.email, status: 'error', message: 'Nieoczekiwany błąd' });
    }
  }
  
  return results;
}
