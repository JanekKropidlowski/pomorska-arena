import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { AUTO_CREATE_USERS } from "@/lib/autoCreateUsers";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // Inicjalizacja bez tworzenia użytkowników
  useEffect(() => {
    setInitializing(false);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    const redirect = params.get("redirect");
    // Jeżeli jest redirect w URL, respektuj go
    if (redirect) {
      navigate(redirect);
      return;
    }
    // W innym przypadku przekieruj wg roli
    const stored = localStorage.getItem('lzs-current-user');
    try {
      const parsed = stored ? JSON.parse(stored) : null;
      const role = (parsed?.role || '').toLowerCase();
      if (role === 'admin') {
        navigate('/administrator');
      } else if (role === 'office') {
        navigate('/biuro');
      } else if (role === 'judge') {
        navigate('/sedzia');
      } else {
        navigate('/');
      }
    } catch {
      navigate('/');
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Inicjalizacja systemu...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Panel LZS - Logowanie</CardTitle>
            <CardDescription>Wprowadź email i hasło</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Hasło</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logowanie..." : "Zaloguj"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm text-blue-800">Domyślne konta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs text-blue-700">
              {AUTO_CREATE_USERS.map((user, index) => (
                <div key={index} className="flex justify-between">
                  <span className="font-medium">{user.name}:</span>
                  <span>{user.email} / {user.password}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
              <strong>Gotowe!</strong> System używa lokalnej autoryzacji - możesz się zalogować od razu.
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm text-blue-800">System gotowy do użycia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-blue-700 space-y-2">
              <p><strong>✅ Lokalna autoryzacja</strong> - działa na VPS bez Supabase</p>
              <p><strong>✅ Brak konfiguracji</strong> - konta są predefiniowane w kodzie</p>
              <p><strong>✅ Natychmiastowe logowanie</strong> - bez problemów z rate limiting</p>
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-green-700">
                <strong>Gotowe!</strong> Możesz się zalogować używając danych z tabeli powyżej.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


