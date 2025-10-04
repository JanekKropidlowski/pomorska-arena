// Prosty system autoryzacji bez Supabase
export interface SimpleUser {
  id: string;
  email: string;
  role: string;
  name: string;
}

export const SIMPLE_USERS = [
  {
    id: '1',
    email: 'admin@lzs-pomorski.pl',
    password: 'admin123!',
    role: 'admin',
    name: 'Administrator LZS'
  },
  {
    id: '2',
    email: 'biuro@lzs-pomorski.pl',
    password: 'biuro123!',
    role: 'office',
    name: 'Biuro LZS'
  },
  {
    id: '3',
    email: 'sedzia@lzs-pomorski.pl',
    password: 'sedzia123!',
    role: 'judge',
    name: 'Sędzia LZS'
  }
];

export function authenticateUser(email: string, password: string): SimpleUser | null {
  const user = SIMPLE_USERS.find(u => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}

export function getCurrentUser(): SimpleUser | null {
  const userData = localStorage.getItem('lzs-current-user');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
  return null;
}

export function setCurrentUser(user: SimpleUser | null): void {
  if (user) {
    localStorage.setItem('lzs-current-user', JSON.stringify(user));
  } else {
    localStorage.removeItem('lzs-current-user');
  }
}

export function logout(): void {
  localStorage.removeItem('lzs-current-user');
}
