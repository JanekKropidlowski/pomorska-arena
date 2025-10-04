import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StandardHeader } from '@/components/StandardHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEvents } from '@/hooks/useEvents';
import { useCompetitions } from '@/hooks/useCompetitions';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  FileText,
  Clock,
  Mail,
  Phone,
  Building
} from 'lucide-react';

interface Event {
  id: string;
  name: string;
  slug?: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  status: string;
  event_type: string;
  is_cyclic: boolean;
  organizer?: string;
  contact_email?: string;
  contact_phone?: string;
  registration_deadline?: string;
  max_participants?: number;
  max_teams?: number;
  event_rules?: string;
  logo_url?: string;
  regulations_pdf_url?: string;
  patron_honorowy?: string;
  organizatorzy?: string;
  contact_person_1_name?: string;
  contact_person_1_title?: string;
  contact_person_1_phone?: string;
  contact_person_2_name?: string;
  contact_person_2_title?: string;
  contact_person_2_phone?: string;
}

export default function EventDetails() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { events, loading: eventsLoading } = useEvents();
  
  // Find event by slug or ID
  const event = events.find(e => e.slug === eventId || e.id === eventId);
  const { competitions, loading: competitionsLoading } = useCompetitions(event?.id);

  if (eventsLoading || competitionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <header className="bg-background border-b shadow-sm">
          <div className="mobile-container py-4">
            <div className="flex items-center space-x-3">
              <img src={`${import.meta.env.BASE_URL}lzs-logo.png`} alt="LZS Logo" className="h-10 w-auto" />
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  Pomorskie Zrzeszenie LZS
                </h1>
                <p className="text-sm text-muted-foreground">
                  System Zawodów Sportowych
                </p>
              </div>
            </div>
          </div>
        </header>
        <main className="mobile-container py-8">
          <div className="text-center">Ładowanie...</div>
        </main>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <header className="bg-background border-b shadow-sm">
          <div className="mobile-container py-4">
            <div className="flex items-center space-x-3">
              <img src={`${import.meta.env.BASE_URL}lzs-logo.png`} alt="LZS Logo" className="h-10 w-auto" />
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  Pomorskie Zrzeszenie LZS
                </h1>
                <p className="text-sm text-muted-foreground">
                  System Zawodów Sportowych
                </p>
              </div>
            </div>
          </div>
        </header>
        <main className="mobile-container py-8">
          <div className="text-center">
            <p className="text-xl mb-4">Wydarzenie nie zostało znalezione</p>
            <Button onClick={() => navigate('/')}>Powrót do strony głównej</Button>
          </div>
        </main>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  return (
    <div className="page-container">
      <StandardHeader 
        title="Szczegóły wydarzenia"
        subtitle="Pomorskie Zrzeszenie LZS"
        showNavigation={true}
        showUserInfo={false}
        showNotifications={false}
      />
      
      <main className="page-content">
        <div className="container-standard">

        {/* Hero Section with Event Title */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-10 text-white shadow-xl mb-12">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="flex-1">
              <Badge className="bg-white/20 text-white mb-6 hover:bg-white/30 transition-colors">
                Zawody Strzeleckie
              </Badge>
              <h1 className="text-3xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                II Mistrzostwa Województwa Pomorskiego Szkół Ponadpodstawowych w Strzelectwie "W Dychę" o Puchar Prezesa Pomorskiego Zrzeszenia LZS
              </h1>
              <div className="flex flex-wrap gap-8 text-white/90 text-base">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6" />
                  <span className="font-medium">{formatDate(event.start_date)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6" />
                  <span className="font-medium">{event.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6" />
                  <span className="font-medium">Otwarcie: 10:00</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {event.logo_url ? (
                <img 
                  src={event.logo_url} 
                  alt="Logo wydarzenia" 
                  className="w-24 h-24 sm:w-32 sm:h-32 object-contain bg-white rounded-lg p-3 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-lg flex items-center justify-center">
                  <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-white/70" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call to Action - Prominent Registration Button */}
        <Card className="border-brand-primary shadow-lg hover:shadow-xl transition-shadow mb-12">
          <CardHeader className="bg-gradient-to-r from-brand-primary/10 to-brand-primary-light/10 p-8">
            <CardTitle className="text-2xl text-brand-primary flex items-center gap-3">
              <Users className="h-6 w-6" />
              Zgłoszenia drużyn
            </CardTitle>
            <CardDescription className="text-lg">
              Każda szkoła może samodzielnie zgłosić swoją drużynę
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground text-lg">
                  <Calendar className="h-5 w-5" />
                  <span><strong>Termin zgłoszeń:</strong> do {formatDate(event.registration_deadline || event.start_date)}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground text-lg">
                  <Users className="h-5 w-5" />
                  <span><strong>Wymagany skład:</strong> 6 zawodników (3 dziewczęta + 3 chłopców)</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground text-lg">
                  <Mail className="h-5 w-5" />
                  <span><strong>Email zgłoszeń:</strong> esio13@poczta.onet.pl</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground text-lg">
                  <FileText className="h-5 w-5" />
                  <span><strong>Wymagania:</strong> legitymacja szkolna, strój sportowy</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-brand-primary hover:bg-brand-primary-dark text-white px-8 py-3 text-lg"
                  onClick={() => navigate(`/rejestracja/${event.id}`)}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Zgłoś drużynę
                </Button>
                {event.regulations_pdf_url && (
                  <Button 
                    variant="outline"
                    onClick={() => window.open(event.regulations_pdf_url, '_blank')}
                    className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-8 py-3 text-lg"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Regulamin
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mobile-grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-8">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <FileText className="h-6 w-6" />
                  Opis wydarzenia
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none whitespace-pre-line">
                  {event.description}
                </div>
              </CardContent>
            </Card>

            {/* Competitions */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-8">
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <Trophy className="h-6 w-6" />
                  Konkurencje ({competitions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {competitions.length > 0 ? (
                  <div className="space-y-6">
                    {competitions.map((comp, index) => (
                      <div 
                        key={comp.id} 
                        className="border-l-4 border-brand-primary pl-6 py-6 rounded-r-lg bg-gradient-to-r from-brand-primary/5 to-transparent hover:from-brand-primary/10 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-semibold text-foreground text-xl">
                            {index + 1}. {comp.name}
                          </h4>
                          <Badge variant="secondary" className="text-sm">
                            {comp.metric_type || 'Punkty'}
                          </Badge>
                        </div>
                        <p className="text-base text-muted-foreground mb-4">
                          {comp.description || 'Brak opisu konkurencji'}
                        </p>
                        {comp.rules && (
                          <div className="bg-muted/50 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground">
                              <strong>Zasady:</strong> {comp.rules}
                            </p>
                          </div>
                        )}
                        {comp.scoring_formula && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                              <strong>Formuła punktacji:</strong> {comp.scoring_formula}
                            </p>
                          </div>
                        )}
                        {comp.penalty_rules && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-800">
                              <strong>Zasady kar:</strong> {comp.penalty_rules}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-lg text-muted-foreground mb-2">Brak zdefiniowanych konkurencji</p>
                    <p className="text-sm text-muted-foreground">
                      Konkurencje zostaną dodane przez administratora w panelu zarządzania wydarzeniami
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Info */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-3 text-lg text-brand-primary">
                  <Building className="h-5 w-5" />
                  Kontakt
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-2">ORGANIZATOR I WSPÓŁORGANIZATORZY</p>
                  <p className="text-base font-medium">{(event as any).organizatorzy || 'Pomorskie Zrzeszenie LZS'}</p>
                </div>
                
                <div className="space-y-4">
                  {(event as any).contact_person_1_name && (
                    <div className="flex items-start gap-4 text-base p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <Phone className="h-5 w-5 text-brand-primary mt-1" />
                      <div>
                        <p className="font-medium text-sm text-muted-foreground">{(event as any).contact_person_1_name}</p>
                        <p className="text-sm">{(event as any).contact_person_1_title}</p>
                        {(event as any).contact_person_1_phone && (
                          <a href={`tel:${(event as any).contact_person_1_phone}`} className="text-brand-primary hover:text-brand-primary-dark hover:underline font-medium text-sm">
                            {(event as any).contact_person_1_phone}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {(event as any).contact_person_2_name && (
                    <div className="flex items-start gap-4 text-base p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <Phone className="h-5 w-5 text-brand-primary mt-1" />
                      <div>
                        <p className="font-medium text-sm text-muted-foreground">{(event as any).contact_person_2_name}</p>
                        <p className="text-sm">{(event as any).contact_person_2_title}</p>
                        {(event as any).contact_person_2_phone && (
                          <a href={`tel:${(event as any).contact_person_2_phone}`} className="text-brand-primary hover:text-brand-primary-dark hover:underline font-medium text-sm">
                            {(event as any).contact_person_2_phone}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {(event as any).patron_honorowy && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm font-medium text-amber-800 mb-2">PATRONAT HONOROWY:</p>
                    <p className="text-sm text-amber-700">{(event as any).patron_honorowy}</p>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
