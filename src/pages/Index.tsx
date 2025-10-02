import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { CompetitionCard } from "@/components/CompetitionCard";
import { RoleCard } from "@/components/RoleCard";
import { useEvents } from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Gavel, 
  FileText, 
  Settings, 
  TrendingUp,
  Calendar,
  Trophy,
  Target,
  Timer,
  Medal
} from "lucide-react";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { events, loading } = useEvents();

  // Filter only featured/active events
  const featuredEvents = events.filter(e => e.status === 'active');

  // Sample data for competitions (keeping for fallback)
  const upcomingCompetitions = [
    {
      title: "Mistrzostwa Pomorskiego LZS w Strzelectwie",
      description: "Zawody strzeleckie z bronią krótką i długą oraz rzut granatem",
      date: "15 października 2024",
      location: "Kłanino, Gdańsk", 
      participants: 45,
      maxParticipants: 60,
      status: "active" as const,
      competitions: ["Broń krótka", "Broń długa", "Rzut granatem", "Bieg przełajowy"],
    },
    {
      title: "Biegi Przełajowe LZS",
      description: "Zawody biegowe na dystansie 3km w kategorii młodzież",
      date: "22 października 2024", 
      location: "Starzyna",
      participants: 28,
      maxParticipants: 40,
      status: "pending" as const,
      competitions: ["Bieg 3km M", "Bieg 3km K"],
    },
    {
      title: "Letnie Mistrzostwa LZS 2024",
      description: "Kompleksowe zawody sportowe w różnych dyscyplinach",
      date: "5 września 2024",
      location: "Gdynia",
      participants: 120,
      maxParticipants: 120, 
      status: "completed" as const,
      competitions: ["Lekkoatletyka", "Pływanie", "Gry zespołowe"],
    },
  ];

  const roleCards = [
    {
      title: "Panel Drużyny",
      description: "Zgłaszanie zawodników, dokumenty, harmonogram",
      icon: Users,
      buttonText: "Przejdź do panelu drużyny",
      buttonVariant: "competition" as const,
      onAction: () => window.location.href = '/team',
    },
    {
      title: "Panel Sędziego", 
      description: "Wprowadzanie wyników, listy startowe, karty sędziowskie",
      icon: Gavel,
      buttonText: "Panel sędziego",
      buttonVariant: "judge" as const,
      onAction: () => window.location.href = '/judge',
    },
    {
      title: "Biuro Zawodów",
      description: "Weryfikacja zgłoszeń, publikacja wyników, raporty",
      icon: FileText,
      buttonText: "Biuro zawodów",
      buttonVariant: "default" as const,
      onAction: () => window.location.href = '/office',
    },
    {
      title: "Administrator",
      description: "Konfiguracja wydarzeń, zarządzanie systemem",
      icon: Settings,
      buttonText: "Panel administratora", 
      buttonVariant: "outline" as const,
      onAction: () => window.location.href = '/admin',
    },
  ];

  const stats = [
    { label: "Aktywne wydarzenia", value: "3", icon: Calendar, color: "text-primary" },
    { label: "Zarejestrowane drużyny", value: "28", icon: Users, color: "text-success" },
    { label: "Konkurencje", value: "12", icon: Trophy, color: "text-warning" },
    { label: "Średnia frekwencja", value: "85%", icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header 
        userRole="Administrator" 
        userName="Jan Kowalski"
        notifications={3}
      />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 animate-fade-in">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              System Zawodów Sportowych
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Kompleksowe zarządzanie zawodami sportowymi Pomorskiego Zrzeszenia LZS
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge className="bg-primary text-primary-foreground px-3 py-1">
                <Target className="h-3 w-3 mr-1" />
                Multitenant
              </Badge>
              <Badge className="bg-success text-success-foreground px-3 py-1">
                <Timer className="h-3 w-3 mr-1" />
                Real-time
              </Badge>
              <Badge className="bg-accent text-accent-foreground px-3 py-1">
                <Medal className="h-3 w-3 mr-1" />
                Multi-event
              </Badge>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-card transition-shadow">
              <CardContent className="pt-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-light mb-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Role Selection */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Wybierz swoją rolę
            </h2>
            <p className="text-muted-foreground">
              Uzyskaj dostęp do dedykowanego panelu dla swojej roli w systemie
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roleCards.map((role, index) => (
              <RoleCard key={index} {...role} />
            ))}
          </div>
        </section>

        {/* Featured Events */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                Wyróżnione wydarzenia
              </h2>
              <p className="text-muted-foreground">
                Aktualne zawody sportowe Pomorskiego LZS
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/public')}>
              Zobacz wszystkie
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Ładowanie wydarzeń...</p>
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Brak aktywnych wydarzeń</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-elegant transition-shadow cursor-pointer" onClick={() => navigate(`/event/${event.id}`)}>
                  <CardHeader>
                    {event.logo_url && (
                      <div className="flex justify-center mb-4">
                        <img src={event.logo_url} alt="Logo" className="h-16 object-contain" />
                      </div>
                    )}
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                    <CardDescription>
                      {new Date(event.start_date).toLocaleDateString('pl-PL', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <p className="line-clamp-3 text-muted-foreground">
                        {event.description?.substring(0, 150)}...
                      </p>
                    </div>
                    <Button variant="competition" className="w-full mt-4">
                      Zobacz szczegóły i zgłoś drużynę
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="bg-card rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Szybkie akcje
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="competition" className="h-12">
              <Calendar className="h-4 w-4 mr-2" />
              Utwórz nowe wydarzenie
            </Button>
            <Button variant="secondary" className="h-12">
              <FileText className="h-4 w-4 mr-2" />
              Wygeneruj raport
            </Button>
            <Button variant="outline" className="h-12">
              <Trophy className="h-4 w-4 mr-2" />
              Zobacz wyniki
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
