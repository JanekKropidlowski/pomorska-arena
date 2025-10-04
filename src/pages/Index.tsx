import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { 
  Calendar,
  MapPin,
  Users,
  Trophy,
  Target,
  Timer,
  Medal,
  Plus
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { events, loading } = useEvents();
  const { user, signOut } = useAuth();

  const handlePanelClick = () => {
    const role = (user?.role || '').toLowerCase();
    if (!user) {
      navigate('/logowanie');
      return;
    }
    if (role === 'admin') {
      navigate('/administrator');
    } else if (role === 'office') {
      navigate('/biuro');
    } else if (role === 'judge') {
      navigate('/sedzia');
    } else {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Filter only published/active events
  const availableEvents = events.filter(e => e.status === 'published' || e.status === 'active');

  return (
    <div className="page-container">
      {/* Public Header */}
      <header className="page-header">
        <div className="container-standard py-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img src={`${import.meta.env.BASE_URL}lzs-logo.png`} alt="LZS Logo" className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Pomorskie Zrzeszenie LZS
                </h1>
                <p className="text-sm text-muted-foreground">
                  System Zawodów Sportowych
                </p>
              </div>
            </button>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handlePanelClick}>
                Panel
              </Button>
              <Button variant="outline" onClick={() => navigate('/publiczne-wyniki')}>
                Zobacz wyniki
              </Button>
              {user && (
                <Button variant="ghost" onClick={handleLogout}>
                  Wyloguj
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="page-content page-section">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="mobile-heading font-bold text-foreground mb-4">
              Zawody Sportowe LZS
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Zgłoś swoją drużynę do zawodów sportowych Pomorskiego Zrzeszenia LZS
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge className="bg-primary text-primary-foreground px-3 py-1">
                <Target className="h-3 w-3 mr-1" />
                Bezpłatne
              </Badge>
              <Badge className="bg-success text-success-foreground px-3 py-1">
                <Timer className="h-3 w-3 mr-1" />
                Real-time
              </Badge>
              <Badge className="bg-accent text-accent-foreground px-3 py-1">
                <Medal className="h-3 w-3 mr-1" />
                Wielodyscyplinowe
              </Badge>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-foreground mb-2">
              Dostępne zawody
            </h2>
            <p className="text-muted-foreground">
              Wybierz zawody i zgłoś swoją drużynę
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Ładowanie wydarzeń...</p>
            </div>
          ) : availableEvents.length === 0 ? (
            <div className="text-center py-12">
              <Card className="max-w-md mx-auto">
                <CardContent className="pt-6">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Brak dostępnych zawodów</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Sprawdź ponownie później
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="mobile-grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {availableEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-elegant transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <img src={`${import.meta.env.BASE_URL}lzs-logo.png`} alt="LZS Logo" className="h-16 object-contain" />
                    </div>
                    <CardTitle className="text-xl text-center">{event.name}</CardTitle>
                    <CardDescription className="text-center">
                      {new Date(event.start_date).toLocaleDateString('pl-PL', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {event.registration_deadline 
                            ? `Zgłoszenia do: ${new Date(event.registration_deadline).toLocaleDateString('pl-PL')}`
                            : 'Zgłoszenia otwarte'
                          }
                        </span>
                      </div>
                      {event.max_participants && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>Maksymalnie {event.max_participants} uczestników</span>
                        </div>
                      )}
                    </div>
                    
                    {event.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {event.description}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        variant="competition" 
                        className="flex-1"
                        onClick={() => navigate(`/wydarzenie/${event.slug || event.id}`)}
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        Zobacz szczegóły
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/rejestracja/${event.slug || event.id}`)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Zgłoś drużynę
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Info Section */}
        <section className="bg-card rounded-lg p-8 shadow-card">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">
              Jak to działa?
            </h3>
            <div className="mobile-grid md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h4 className="font-medium mb-2">Wybierz zawody</h4>
                <p className="text-sm text-muted-foreground">
                  Przeglądaj dostępne zawody i wybierz te, które Cię interesują
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h4 className="font-medium mb-2">Zgłoś drużynę</h4>
                <p className="text-sm text-muted-foreground">
                  Wypełnij formularz zgłoszeniowy i dodaj zawodników
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h4 className="font-medium mb-2">Śledź wyniki</h4>
                <p className="text-sm text-muted-foreground">
                  Oglądaj wyniki na żywo i pobieraj dokumenty
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
