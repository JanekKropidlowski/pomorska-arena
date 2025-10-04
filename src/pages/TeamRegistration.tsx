import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RegistrationForm } from '@/components/RegistrationForm';
import { StandardHeader } from '@/components/StandardHeader';
import { useEvents } from '@/hooks/useEvents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home } from 'lucide-react';

const TeamRegistration = () => {
  const { eventId } = useParams();
  const { events, loading: eventsLoading } = useEvents();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Find event by slug or ID
  const event = events.find(e => e.slug === eventId || e.id === eventId);
  const actualEventId = event?.id;

  const handleSuccess = () => {
    setShowSuccess(true);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // Success popup
  if (showSuccess) {
    return (
      <div className="page-container">
        <StandardHeader 
          title="Rejestracja drużyny"
          subtitle="Pomorskie Zrzeszenie LZS"
          showNavigation={false}
          showUserInfo={false}
          showNotifications={false}
        />
        
        <main className="page-content page-section">
          <div className="container-standard max-w-2xl">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-green-600">Zgłoszenie zarejestrowane!</CardTitle>
                <CardDescription className="text-lg">
                  Twoje zgłoszenie zostało pomyślnie wysłane i oczekuje na zatwierdzenie.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Otrzymasz potwierdzenie na podany adres email. Dziękujemy za udział w zawodach!
                </p>
                <Button onClick={handleGoHome} className="w-full">
                  <Home className="h-4 w-4 mr-2" />
              Wróć do strony głównej
            </Button>
          </CardContent>
        </Card>
          </div>
        </main>
      </div>
    );
  }

  // Jeśli nie ma eventId, pokaż informację o wyborze wydarzenia
  if (!eventId) {
  return (
      <div className="page-container">
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
          </div>
        </div>
      </header>

        <main className="page-content page-section">
          <div className="container-standard max-w-4xl">
            <div className="text-center space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Wybierz wydarzenie</h1>
              <p className="text-lg text-muted-foreground">
                Aby zarejestrować drużynę, wybierz najpierw wydarzenie z listy poniżej
              </p>
              <div className="mt-8">
                <a 
                  href="/" 
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Zobacz dostępne wydarzenia
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Ładowanie wydarzeń
  if (eventsLoading) {
    return (
      <div className="page-container">
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
            </div>
          </div>
        </header>
        <main className="page-content page-section">
          <div className="container-standard max-w-4xl text-center">
            <p className="text-muted-foreground">Ładowanie...</p>
          </div>
        </main>
      </div>
    );
  }

  // Jeśli nie znaleziono wydarzenia
  if (!event || !actualEventId) {
    return (
      <div className="page-container">
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
            </div>
          </div>
        </header>
        <main className="page-content page-section">
          <div className="container-standard max-w-4xl">
            <div className="text-center space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Wydarzenie nie znalezione</h1>
              <p className="text-lg text-muted-foreground">
                Nie udało się znaleźć wydarzenia o podanym identyfikatorze
              </p>
              <div className="mt-8">
                <Button onClick={handleGoHome}>
                  Wróć do strony głównej
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Jeśli mamy event, wyświetl formularz rejestracji
  return (
    <div className="page-container">
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
          </div>
        </div>
      </header>

      <main className="page-content page-section">
        <div className="container-standard max-w-5xl">
          <RegistrationForm eventId={actualEventId} onSuccess={handleSuccess} />
        </div>
      </main>
    </div>
  );
};

export default TeamRegistration;