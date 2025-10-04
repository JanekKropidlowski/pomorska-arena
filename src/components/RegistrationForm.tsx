import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, School, Trash2, Pencil, Plus, Save, X } from 'lucide-react';

interface RegistrationFormProps {
  eventId: string;
  onSuccess?: () => void;
}

interface TeamFormData {
  teamName: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

interface ParticipantFormData {
  id: string;
  firstName: string;
  lastName: string;
  birthYear: number;
  gender: 'male' | 'female';
}

export function RegistrationForm({ eventId, onSuccess }: RegistrationFormProps) {
  const [participants, setParticipants] = useState<ParticipantFormData[]>([]);
  const [editingParticipantId, setEditingParticipantId] = useState<string | null>(null);
  const [constraints, setConstraints] = useState<{ team_max_size?: number; team_required_girls?: number; team_required_boys?: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<TeamFormData>();
  const participantForm = useForm<ParticipantFormData>({
    defaultValues: { birthYear: new Date().getFullYear() - 16 }
  });

  // Load event constraints
  useEffect(() => {
    const loadConstraints = async () => {
      const { data: eventData, error } = await supabase
        .from('events')
        .select('team_max_size, team_required_girls, team_required_boys')
        .eq('id', eventId)
        .single();
      
      if (!error && eventData) {
        setConstraints(eventData);
      }
    };
    
    loadConstraints();
  }, [eventId]);

  const onParticipantAdd = (data: Omit<ParticipantFormData, 'id'>) => {
    const newParticipant: ParticipantFormData = { ...data, id: Date.now().toString() };
    setParticipants([...participants, newParticipant]);
    participantForm.reset();
    toast({
      title: "Dodano zawodnika",
      description: `${data.firstName} ${data.lastName}`,
    });
  };

  const onParticipantEdit = (id: string, updatedData: Omit<ParticipantFormData, 'id'>) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    setEditingParticipantId(null);
    toast({
      title: "Zapisano zmiany",
      description: "Dane zawodnika zaktualizowane",
    });
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Usunięto zawodnika",
      description: "Zawodnik został usunięty z listy",
    });
  };

  const onSubmit = async (data: TeamFormData) => {
    if (participants.length === 0) {
      toast({
        title: "Błąd",
        description: "Dodaj przynajmniej jednego zawodnika",
        variant: "destructive"
      });
      return;
    }

    // Validate team composition
    const teamMax = constraints?.team_max_size || null;
    const reqGirls = constraints?.team_required_girls || 0;
    const reqBoys = constraints?.team_required_boys || 0;

    const girls = participants.filter(p => p.gender === 'female').length;
    const boys = participants.filter(p => p.gender === 'male').length;
    const total = participants.length;

    if (teamMax && total > teamMax) {
      toast({ title: 'Błąd', description: `Maksymalna liczba osób w drużynie: ${teamMax}`, variant: 'destructive' });
      return;
    }
    if (reqGirls && girls < reqGirls) {
      toast({ title: 'Błąd', description: `Wymagana liczba dziewcząt: ${reqGirls}`, variant: 'destructive' });
      return;
    }
    if (reqBoys && boys < reqBoys) {
      toast({ title: 'Błąd', description: `Wymagana liczba chłopców: ${reqBoys}`, variant: 'destructive' });
      return;
    }
    if (reqGirls && girls > reqGirls) {
      toast({ title: 'Błąd', description: `Maksymalna liczba dziewcząt: ${reqGirls}`, variant: 'destructive' });
      return;
    }
    if (reqBoys && boys > reqBoys) {
      toast({ title: 'Błąd', description: `Maksymalna liczba chłopców: ${reqBoys}`, variant: 'destructive' });
      return;
    }

    setSubmitting(true);

    try {
      // Create team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: data.teamName,
          type: 'school',
          contact_person: data.contactPerson,
          contact_email: data.contactEmail,
          contact_phone: data.contactPhone,
          address: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (teamError) throw teamError;

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
            birth_date: `${participant.birthYear}-01-01`,
            gender: participant.gender,
            team_id: team.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (participantError) throw participantError;

        // Calculate age and assign category
        const birthYear = participant.birthYear;
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;

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
            team_id: team.id,
            participant_id: newParticipant.id,
            age_category_id: category.id,
            status: 'pending',
            registration_date: new Date().toISOString()
          });

        if (registrationError) throw registrationError;
      }

      toast({
        title: "Zgłoszenie wysłane!",
        description: `Zarejestrowano drużynę "${data.teamName}" z ${participants.length} zawodnikami`,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się wysłać zgłoszenia",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Information */}
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamName">Nazwa drużyny *</Label>
                <Input
                  id="teamName"
                  {...form.register('teamName', { required: true })}
                  placeholder="np. SP nr 15 Gdynia"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Opiekun/Trener *</Label>
                <Input
                  id="contactPerson"
                  {...form.register('contactPerson', { required: true })}
                  placeholder="Imię i nazwisko"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email kontaktowy *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    {...form.register('contactEmail', { required: true })}
                    placeholder="email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Telefon *</Label>
                  <Input
                    id="contactPhone"
                    {...form.register('contactPhone', { required: true })}
                    placeholder="+48 123 456 789"
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Participants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Zawodnicy
          </CardTitle>
          <CardDescription>
            Dodano: {participants.length} zawodników. 
            {constraints && (
              <span className="block mt-1 text-sm">
                Wymagany skład: {constraints.team_max_size || 'dowolnie'} osób 
                ({constraints.team_required_girls || 0} dziewcząt, {constraints.team_required_boys || 0} chłopców)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Participant Form */}
          <form onSubmit={participantForm.handleSubmit(onParticipantAdd)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="birthYear">Rok urodzenia *</Label>
                <Input
                  id="birthYear"
                  type="number"
                  {...participantForm.register('birthYear', { required: true, min: 1900, max: new Date().getFullYear() })}
                  placeholder="YYYY"
                />
              </div>
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

            <Button type="submit" variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Dodaj zawodnika
            </Button>
          </form>

          {/* Participants List */}
          {participants.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-lg">Lista zawodników:</h4>
              {participants.map((p) => (
                <div key={p.id} className="flex flex-col md:flex-row items-center gap-3 p-3 border rounded-md bg-secondary/10">
                  {editingParticipantId === p.id ? (
                    <EditParticipantForm
                      participant={p}
                      onSave={(updatedData) => onParticipantEdit(p.id, updatedData)}
                      onCancel={() => setEditingParticipantId(null)}
                    />
                  ) : (
                    <>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                        <span className="font-medium">{p.firstName} {p.lastName}</span>
                        <span className="text-sm text-muted-foreground">Rok ur.: {p.birthYear}</span>
                        <span className="text-sm text-muted-foreground">Płeć: {p.gender === 'male' ? 'Mężczyzna' : 'Kobieta'}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingParticipantId(p.id)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => removeParticipant(p.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={form.handleSubmit(onSubmit)}
            variant="competition"
            className="w-full mt-6"
            disabled={participants.length === 0 || submitting}
          >
            {submitting ? "Wysyłanie..." : "Wyślij zgłoszenie"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface EditParticipantFormProps {
  participant: ParticipantFormData;
  onSave: (data: Omit<ParticipantFormData, 'id'>) => void;
  onCancel: () => void;
}

const EditParticipantForm = ({ participant, onSave, onCancel }: EditParticipantFormProps) => {
  const { register, handleSubmit } = useForm<Omit<ParticipantFormData, 'id'>>({
    defaultValues: {
      firstName: participant.firstName,
      lastName: participant.lastName,
      birthYear: participant.birthYear,
      gender: participant.gender,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center w-full">
      <Input {...register('firstName', { required: true })} placeholder="Imię" />
      <Input {...register('lastName', { required: true })} placeholder="Nazwisko" />
      <Input type="number" {...register('birthYear', { required: true, min: 1900, max: new Date().getFullYear(), valueAsNumber: true })} placeholder="Rok ur." />
      <select {...register('gender', { required: true })} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
        <option value="male">Mężczyzna</option>
        <option value="female">Kobieta</option>
      </select>
      <div className="flex gap-2 col-span-full sm:col-span-1 sm:justify-end">
        <Button type="submit" size="icon" variant="ghost">
          <Save className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};