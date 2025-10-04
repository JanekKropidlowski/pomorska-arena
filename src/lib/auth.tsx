import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { authenticateUser, getCurrentUser, setCurrentUser, logout, SimpleUser } from "./simpleAuth";

type AuthUser = {
  id: string;
  email: string | null;
  role?: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sprawdź czy użytkownik jest już zalogowany
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser({
        id: currentUser.id,
        email: currentUser.email,
        role: currentUser.role
      });
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const user = authenticateUser(email, password);
    if (user) {
      setCurrentUser(user);
      setUser({
        id: user.id,
        email: user.email,
        role: user.role
      });
      return {};
    } else {
      return { error: 'Nieprawidłowy email lub hasło' };
    }
  };

  const signOut = async () => {
    logout();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(() => ({ user, loading, signIn, signOut }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


