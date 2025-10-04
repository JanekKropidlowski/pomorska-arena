import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Trophy, 
  Globe, 
  X, 
  Settings,
  Bell,
  LogOut
} from "lucide-react";

interface StandardHeaderProps {
  title: string;
  subtitle?: string;
  showNavigation?: boolean;
  showUserInfo?: boolean;
  showNotifications?: boolean;
  notifications?: number;
}

export function StandardHeader({ 
  title, 
  subtitle = "Pomorskie Zrzeszenie LZS",
  showNavigation = true,
  showUserInfo = true,
  showNotifications = true,
  notifications = 0
}: StandardHeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/logowanie');
  };

  const handleNavigateToOffice = () => {
    navigate('/biuro');
  };

  const handleNavigateToJudge = () => {
    navigate('/sedzia');
  };

  const handleNavigateToHome = () => {
    navigate('/');
  };

  return (
    <header className="page-header sticky top-0 z-50">
      <div className="container-standard">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleNavigateToHome}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">LZS</span>
              </div>
              <div className="leading-tight text-left">
                <h1 className="text-sm sm:text-base font-semibold">Pomorskie Zrzeszenie LZS</h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground">System Zawodów Sportowych</p>
              </div>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {showUserInfo && user && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {user.role || 'user'}
                </Badge>
                <span className="text-sm font-medium">{user.email || 'Użytkownik'}</span>
              </div>
            )}
            
            {showNavigation && (
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={handleNavigateToOffice}>
                  <Users className="h-4 w-4 mr-2" />
                  Biuro
                </Button>
                
                <Button variant="ghost" size="sm" onClick={handleNavigateToJudge}>
                  <Trophy className="h-4 w-4 mr-2" />
                  Sędzia
                </Button>
                
                <Button variant="ghost" size="sm" onClick={handleNavigateToHome}>
                  <Globe className="h-4 w-4 mr-2" />
                  Strona główna
                </Button>
                
                {showNotifications && (
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {notifications > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center bg-destructive">
                        {notifications > 9 ? '9+' : notifications}
                      </Badge>
                    )}
                  </Button>
                )}
                
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
