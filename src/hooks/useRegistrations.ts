import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Registration {
  id: string;
  event_id: string;
  team_id: string;
  participant_id: string;
  age_category_id: string;
  status: string;
  registration_date: string;
  approved_at: string | null;
  approved_by: string | null;
  notes: string | null;
  start_number: number | null;
  teams: {
    name: string;
    type: string;
    contact_person: string | null;
    contact_email: string | null;
  };
  participants: {
    first_name: string;
    last_name: string;
    birth_date: string;
    gender: string;
  };
  age_categories: {
    name: string;
  };
}

export function useRegistrations(eventId?: string) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadRegistrations = async () => {
    try {
      let query = supabase
        .from('registrations')
        .select(`
          *,
          teams (name, type, contact_person, contact_email),
          participants (first_name, last_name, birth_date, gender),
          age_categories (name)
        `)
        .order('registration_date', { ascending: false });

      if (eventId) {
        query = query.eq('event_id', eventId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error('Error loading registrations:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się załadować zgłoszeń",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const approveRegistration = async (registrationId: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', registrationId);

      if (error) throw error;

      toast({
        title: "Zatwierdzone",
        description: "Zgłoszenie zostało zatwierdzone",
      });

      await loadRegistrations();
    } catch (error) {
      console.error('Error approving registration:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zatwierdzić zgłoszenia",
        variant: "destructive"
      });
    }
  };

  const rejectRegistration = async (registrationId: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({
          status: 'rejected',
          notes
        })
        .eq('id', registrationId);

      if (error) throw error;

      toast({
        title: "Odrzucone",
        description: "Zgłoszenie zostało odrzucone",
      });

      await loadRegistrations();
    } catch (error) {
      console.error('Error rejecting registration:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się odrzucić zgłoszenia",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadRegistrations();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('registrations-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'registrations'
      }, () => {
        loadRegistrations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  return { 
    registrations, 
    loading, 
    refetch: loadRegistrations,
    approveRegistration,
    rejectRegistration
  };
}