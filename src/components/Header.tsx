import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, User, LogOut } from "lucide-react";

interface HeaderProps {
  userRole?: string;
  userName?: string;
  notifications?: number;
}

export function Header({ userRole, userName, notifications = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">LZS</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">System Zawodów</h1>
              <p className="text-xs text-muted-foreground">Pomorskie LZS</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {userRole && userName && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {userRole}
              </Badge>
              <span className="text-sm font-medium">{userName}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center bg-destructive">
                  {notifications > 9 ? '9+' : notifications}
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}