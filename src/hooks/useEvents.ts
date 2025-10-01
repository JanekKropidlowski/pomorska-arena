import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Event {
  id: string;
  name: string;
  description: string | null;
  location: string;
  start_date: string;
  end_date: string | null;
  registration_deadline: string | null;
  event_type: string;
  is_cyclic: boolean;
  cyclic_month: number | null;
  status: string;
  regulations_pdf_url: string | null;
  logo_url: string | null;
  max_participants: number | null;
  max_teams: number | null;
  organizer: string | null;
  contact_email: string | null;
  contact_phone: string | null;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się załadować wydarzeń",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('events-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'events'
      }, () => {
        loadEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { events, loading, refetch: loadEvents };
}