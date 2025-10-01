import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, School } from 'lucide-react';

interface RegistrationFormProps {
  eventId: string;
  onSuccess?: () => void;
}

interface TeamFormData {
  teamName: string;
  teamType: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

interface ParticipantFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'male' | 'female';
}

export function RegistrationForm({ eventId, onSuccess }: RegistrationFormProps) {
  const [step, setStep] = useState<'team' | 'participants'>('team');
  const [teamId, setTeamId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<ParticipantFormData[]>([]);
  const { toast } = useToast();

  const teamForm = useForm<TeamFormData>();
  const participantForm = useForm<ParticipantFormData>();

  const onTeamSubmit = async (data: TeamFormData) => {
    try {
      const { data: team, error } = await supabase
        .from('teams')
        .insert({
          name: data.teamName,
          type: data.teamType,
          contact_person: data.contactPerson,
          contact_email: data.contactEmail,
          contact_phone: data.contactPhone
        })
        .select()
        .single();

      if (error) throw error;

      setTeamId(team.id);
      setStep('participants');
      
      toast({
        title: "Zapisano dane drużyny",
        description: "Teraz dodaj zawodników",
      });
    } catch (error) {
      console.error('Error creating team:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać drużyny",
        variant: "destructive"
      });
    }
  };

  const onParticipantAdd = (data: ParticipantFormData) => {
    setParticipants([...participants, data]);
    participantForm.reset();
    toast({
      title: "Dodano zawodnika",
      description: `${data.firstName} ${data.lastName}`,
    });
  };

  const submitRegistration = async () => {
    if (!teamId || participants.length === 0) {
      toast({
        title: "Błąd",
        description: "Dodaj przynajmniej jednego zawodnika",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get age categories for the event
      const { data: categories } = await supabase
        .from('age_categories')
        .select('*')
        .eq('event_id', eventId);

      if (!categories || categories.length === 0) {
        throw new Error('No age categories found');
      }

      // Create participants and registrations
      for (const participant of participants) {
        // Create participant
        const { data: newParticipant, error: participantError } = await supabase
          .from('participants')
          .insert({
            first_name: participant.firstName,
            last_name: participant.lastName,
            birth_date: participant.birthDate,
            gender: participant.gender,
            team_id: teamId
          })
          .select()
          .single();

        if (participantError) throw participantError;

        // Calculate age and assign category
        const birthYear = new Date(participant.birthDate).getFullYear();
        const age = new Date().getFullYear() - birthYear;
        
        const category = categories.find(cat => {
          const minMatch = !cat.min_age || age >= cat.min_age;
          const maxMatch = !cat.max_age || age <= cat.max_age;
          const genderMatch = cat.gender === 'mixed' || cat.gender === participant.gender;
          return minMatch && maxMatch && genderMatch;
        });

        if (!category) {
          console.warn(`No category found for participant age ${age}`);
          continue;
        }

        // Create registration
        const { error: registrationError } = await supabase
          .from('registrations')
          .insert({
            event_id: eventId,
            team_id: teamId,
            participant_id: newParticipant.id,
            age_category_id: category.id,
            status: 'pending'
          });

        if (registrationError) throw registrationError;
      }

      toast({
        title: "Zgłoszenie wysłane!",
        description: `Zarejestrowano ${participants.length} zawodników`,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się wysłać zgłoszenia",
        variant: "destructive"
      });
    }
  };

  if (step === 'team') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            Dane drużyny
          </CardTitle>
          <CardDescription>
            Podaj informacje o drużynie/organizacji
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={teamForm.handleSubmit(onTeamSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">Nazwa drużyny *</Label>
              <Input
                id="teamName"
                {...teamForm.register('teamName', { required: true })}
                placeholder="np. SP nr 15 Gdynia"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamType">Typ organizacji *</Label>
              <Input
                id="teamType"
                {...teamForm.register('teamType', { required: true })}
                placeholder="np. Szkoła podstawowa, Klub sportowy"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">Opiekun/Trener *</Label>
              <Input
                id="contactPerson"
                {...teamForm.register('contactPerson', { required: true })}
                placeholder="Imię i nazwisko"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email kontaktowy *</Label>
              <Input
                id="contactEmail"
                type="email"
                {...teamForm.register('contactEmail', { required: true })}
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Telefon *</Label>
              <Input
                id="contactPhone"
                {...teamForm.register('contactPhone', { required: true })}
                placeholder="+48 123 456 789"
              />
            </div>

            <Button type="submit" variant="competition" className="w-full">
              Dalej - Dodaj zawodników
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Dodaj zawodników
          </CardTitle>
          <CardDescription>
            Dodano: {participants.length} zawodników
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={participantForm.handleSubmit(onParticipantAdd)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Imię *</Label>
                <Input
                  id="firstName"
                  {...participantForm.register('firstName', { required: true })}
                  placeholder="Imię"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nazwisko *</Label>
                <Input
                  id="lastName"
                  {...participantForm.register('lastName', { required: true })}
                  placeholder="Nazwisko"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data urodzenia *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  {...participantForm.register('birthDate', { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Płeć *</Label>
                <select
                  id="gender"
                  {...participantForm.register('gender', { required: true })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="">Wybierz...</option>
                  <option value="male">Mężczyzna</option>
                  <option value="female">Kobieta</option>
                </select>
              </div>
            </div>

            <Button type="submit" variant="outline" className="w-full">
              Dodaj zawodnika
            </Button>
          </form>

          {participants.length > 0 && (
            <div className="mt-6 space-y-2">
              <h4 className="font-medium">Lista zawodników:</h4>
              {participants.map((p, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span>{p.firstName} {p.lastName}</span>
                  <span className="text-sm text-muted-foreground">
                    {p.gender === 'male' ? 'M' : 'K'} • {p.birthDate}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={submitRegistration}
            variant="competition"
            className="w-full mt-6"
            disabled={participants.length === 0}
          >
            Wyślij zgłoszenie
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}