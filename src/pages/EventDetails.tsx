import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEvents } from '@/hooks/useEvents';
import { useCompetitions } from '@/hooks/useCompetitions';
import { RegistrationForm } from '@/components/RegistrationForm';
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

export default function EventDetails() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { events, loading: eventsLoading } = useEvents();
  const { competitions, loading: competitionsLoading } = useCompetitions(eventId);
  const [showRegistration, setShowRegistration] = useState(false);

  const event = events.find(e => e.id === eventId);

  if (eventsLoading || competitionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header userRole="Gość" userName="" notifications={0} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Ładowanie...</div>
        </main>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header userRole="Gość" userName="" notifications={0} />
        <main className="container mx-auto px-4 py-8">
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

  if (showRegistration) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header userRole="Gość" userName="" notifications={0} />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Button 
              variant="outline" 
              onClick={() => setShowRegistration(false)}
              className="mb-4"
            >
              ← Powrót do szczegółów wydarzenia
            </Button>
            <RegistrationForm 
              eventId={event.id}
              onSuccess={() => {
                setShowRegistration(false);
                navigate('/');
              }}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header userRole="Gość" userName="" notifications={0} />
      
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Button variant="outline" onClick={() => navigate('/')}>
          ← Powrót do strony głównej
        </Button>

        {/* Hero Section with Event Title */}
        <div className="bg-gradient-primary rounded-lg p-8 text-white shadow-elegant">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Badge className="bg-white/20 text-white mb-4">
                {event.event_type === 'competition' ? 'Zawody' : 'Wydarzenie'}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {event.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{formatDate(event.start_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>Otwarcie: 10:00</span>
                </div>
              </div>
            </div>
            {event.logo_url && (
              <img 
                src={event.logo_url} 
                alt="Logo wydarzenia" 
                className="w-24 h-24 object-contain bg-white rounded-lg p-2"
              />
            )}
          </div>
        </div>

        {/* Call to Action - Prominent Registration Button */}
        <Card className="border-primary shadow-elegant">
          <CardHeader className="bg-primary-light">
            <CardTitle className="text-2xl text-primary flex items-center gap-2">
              <Users className="h-6 w-6" />
              Zgłoszenia drużyn
            </CardTitle>
            <CardDescription>
              Każda szkoła może samodzielnie zgłosić swoją drużynę
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1">
                <p className="text-muted-foreground mb-2">
                  <strong>Termin zgłoszeń:</strong> do {formatDate(event.registration_deadline || event.start_date)}
                </p>
                <p className="text-muted-foreground">
                  <strong>Wymagany skład:</strong> 6 zawodników (3 dziewczęta + 3 chłopców)
                </p>
              </div>
              <Button 
                size="lg"
                variant="competition"
                className="text-lg px-8 py-6 h-auto"
                onClick={() => setShowRegistration(true)}
              >
                <Users className="h-5 w-5 mr-2" />
                Zgłoś drużynę / szkołę
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Opis wydarzenia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none whitespace-pre-line">
                  {event.description}
                </div>
              </CardContent>
            </Card>

            {/* Competitions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Konkurencje ({competitions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitions.map((comp, index) => (
                    <div 
                      key={comp.id} 
                      className="border-l-4 border-primary pl-4 py-2"
                    >
                      <h4 className="font-semibold text-foreground mb-1">
                        {index + 1}. {comp.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {comp.description}
                      </p>
                      {comp.rules && (
                        <p className="text-xs text-muted-foreground">
                          <strong>Zasady:</strong> {comp.rules}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building className="h-5 w-5" />
                  Kontakt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {event.organizer && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Organizator</p>
                    <p className="text-sm">{event.organizer}</p>
                  </div>
                )}
                {event.contact_email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${event.contact_email}`} className="text-primary hover:underline">
                      {event.contact_email}
                    </a>
                  </div>
                )}
                {event.contact_phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${event.contact_phone}`} className="text-primary hover:underline">
                      {event.contact_phone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Szczegóły</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {event.max_teams && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Max. liczba drużyn</span>
                    <span className="font-medium">{event.max_teams}</span>
                  </div>
                )}
                {event.max_participants && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Max. uczestników</span>
                    <span className="font-medium">{event.max_participants}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
                    {event.status === 'active' ? 'Aktywne' : event.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
