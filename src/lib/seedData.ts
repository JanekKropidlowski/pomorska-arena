import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AggregationType = Database['public']['Enums']['aggregation_type'];
type MetricType = Database['public']['Enums']['metric_type'];
type Gender = Database['public']['Enums']['gender'];

// Seed the three cyclic events with full configurations
export async function seedCyclicEvents() {
  try {
    // 1. MISTRZOSTWA POMORSKIE W STRZELECTWIE "W DYCHĘ"
    const { data: shootingEvent, error: shootingError } = await supabase
      .from('events')
      .insert({
        name: 'Mistrzostwa Województwa Pomorskiego Szkół Ponadpodstawowych w Strzelectwie – „W Dychę"',
        description: `Cykliczne mistrzostwa strzelectwa dla szkół ponadpodstawowych województwa pomorskiego.
        
Cele:
- Popularyzacja strzelectwa sportowego wśród młodzieży
- Aktywizacja młodzieży szkolnej
- Integracja środowisk szkolnych

Uczestnicy: Drużyny szkolne składające się z 3 dziewcząt i 3 chłopców.

Obowiązek: Każda szkoła musi wystawić zawodników we wszystkich trzech konkurencjach.

Weryfikacja: Lista zgłoszeniowa do wyznaczonej daty, kontrola legitymacji szkolnych na miejscu zawodów.

Nagrody: Dyplomy, puchary, medale indywidualne i drużynowe.`,
        location: 'Kłanino',
        start_date: '2025-10-15',
        event_type: 'shooting',
        is_cyclic: true,
        cyclic_month: 10,
        status: 'published',
        max_teams: 30,
        organizer: 'LZS Pomorski',
        contact_email: 'kontakt@lzs-pomorski.pl',
        logo_url: '/lzs-logo.png'
      })
      .select()
      .single();

    if (shootingError) throw shootingError;

    // Age category for shooting (school students)
    const { data: shootingCategory } = await supabase
      .from('age_categories')
      .insert({
        event_id: shootingEvent.id,
        name: 'Szkoły Ponadpodstawowe',
        min_age: 15,
        max_age: 20,
        gender: 'mixed'
      })
      .select()
      .single();

    // Shooting competitions
    const shootingCompetitions: Database['public']['Tables']['competitions']['Insert'][] = [
      {
        event_id: shootingEvent.id,
        name: 'Strzelectwo',
        description: '5 strzałów z krótkiej broni + 5 strzałów z długiej broni',
        rules: 'Każdy zawodnik wykonuje 5 strzałów z krótkiej broni pneumatycznej oraz 5 strzałów z długiej broni pneumatycznej. Wynik = suma punktów ze wszystkich strzałów.',
        metric_type: 'points' as MetricType,
        aggregation_type: 'sum' as AggregationType,
        attempts_count: 10,
        is_team_competition: true,
        team_size: 6,
        scoring_formula: JSON.stringify({
          type: 'position_points',
          positions: [
            { position: 1, points: 15 },
            { position: 2, points: 13 },
            { position: 3, points: 11 },
            { position: 4, points: 10 },
            { position: 5, points: 9 },
            { position: 6, points: 8 },
            { position: 7, points: 7 },
            { position: 8, points: 6 },
            { position: 9, points: 5 },
            { position: 10, points: 4 },
            { position: 11, points: 3 },
            { position: 12, points: 2 },
            { position: 13, points: 1, andAbove: true }
          ]
        }),
        sort_order: 1
      },
      {
        event_id: shootingEvent.id,
        name: 'Rzut granatem',
        description: 'Rzut granatem do koncentrycznych kół',
        rules: 'Koła punktowane: zewnętrzne = 1 pkt, środkowe = 2 pkt, centralne = 3 pkt. Przy remisie punktowym decyduje mniejsza odległość od środka (pomiar ręczny).',
        metric_type: 'points' as MetricType,
        aggregation_type: 'sum' as AggregationType,
        attempts_count: 3,
        is_team_competition: true,
        team_size: 6,
        scoring_formula: JSON.stringify({
          type: 'position_points',
          positions: [
            { position: 1, points: 15 },
            { position: 2, points: 13 },
            { position: 3, points: 11 },
            { position: 4, points: 10 },
            { position: 5, points: 9 },
            { position: 6, points: 8 },
            { position: 7, points: 7 },
            { position: 8, points: 6 },
            { position: 9, points: 5 },
            { position: 10, points: 4 },
            { position: 11, points: 3 },
            { position: 12, points: 2 },
            { position: 13, points: 1, andAbove: true }
          ]
        }),
        sort_order: 2
      },
      {
        event_id: shootingEvent.id,
        name: 'Bieg przełajowy ~1000m',
        description: 'Bieg przełajowy na dystansie około 1000 metrów',
        rules: 'Wynik określany według kolejności na mecie. Każdy członek drużyny biegnie indywidualnie.',
        metric_type: 'time' as MetricType,
        aggregation_type: 'best_attempt' as AggregationType,
        attempts_count: 1,
        is_team_competition: true,
        team_size: 6,
        scoring_formula: JSON.stringify({
          type: 'position_points',
          positions: [
            { position: 1, points: 15 },
            { position: 2, points: 13 },
            { position: 3, points: 11 },
            { position: 4, points: 10 },
            { position: 5, points: 9 },
            { position: 6, points: 8 },
            { position: 7, points: 7 },
            { position: 8, points: 6 },
            { position: 9, points: 5 },
            { position: 10, points: 4 },
            { position: 11, points: 3 },
            { position: 12, points: 2 },
            { position: 13, points: 1, andAbove: true }
          ]
        }),
        sort_order: 3
      }
    ];

    await supabase.from('competitions').insert(shootingCompetitions);

    // 2. WOJEWÓDZKA SENIORIADA
    const { data: seniorsEvent, error: seniorsError } = await supabase
      .from('events')
      .insert({
        name: 'Wojewódzka Senioriada Pomorskiego LZS',
        description: `Cykliczne zawody sportowe dla seniorów województwa pomorskiego.

Kategorie wiekowe: 55+, 65+, 75+ z podziałem na płeć (K/M).

Cel: Promocja aktywności fizycznej wśród osób starszych, integracja środowisk senioralnych, zdrowy tryb życia.

Uczestnicy: Indywidualni seniorzy i zespoły z całego województwa pomorskiego.`,
        location: 'Skarszewy',
        start_date: '2025-07-10',
        event_type: 'seniors',
        is_cyclic: true,
        cyclic_month: 7,
        status: 'published',
        max_participants: 300,
        organizer: 'LZS Pomorski',
        contact_email: 'kontakt@lzs-pomorski.pl',
        logo_url: '/lzs-logo.png'
      })
      .select()
      .single();

    if (seniorsError) throw seniorsError;

    // Age categories for seniors
    const seniorsCategories: Database['public']['Tables']['age_categories']['Insert'][] = [
      { event_id: seniorsEvent.id, name: 'Kobiety 55+', min_age: 55, max_age: 64, gender: 'female' as Gender },
      { event_id: seniorsEvent.id, name: 'Mężczyźni 55+', min_age: 55, max_age: 64, gender: 'male' as Gender },
      { event_id: seniorsEvent.id, name: 'Kobiety 65+', min_age: 65, max_age: 74, gender: 'female' as Gender },
      { event_id: seniorsEvent.id, name: 'Mężczyźni 65+', min_age: 65, max_age: 74, gender: 'male' as Gender },
      { event_id: seniorsEvent.id, name: 'Kobiety 75+', min_age: 75, max_age: undefined, gender: 'female' as Gender },
      { event_id: seniorsEvent.id, name: 'Mężczyźni 75+', min_age: 75, max_age: undefined, gender: 'male' as Gender }
    ];

    await supabase.from('age_categories').insert(seniorsCategories);

    // Seniors competitions
    const seniorsCompetitions: Database['public']['Tables']['competitions']['Insert'][] = [
      {
        event_id: seniorsEvent.id,
        name: 'Slalom rowerowy',
        description: 'Przejazd rowerem przez tor przeszkód',
        rules: 'Najkrótszy czas wygrywa. Obowiązek ustawienia przewróconych pachołków. Za każde przewrócone pachołko kara +5 sekund.',
        metric_type: 'time' as MetricType,
        aggregation_type: 'best_attempt' as AggregationType,
        attempts_count: 1,
        penalty_rules: JSON.stringify({ knockedCone: 5 }),
        sort_order: 1
      },
      {
        event_id: seniorsEvent.id,
        name: 'Slalom z piłkami',
        description: 'Slalom z piłką zakończony strzałem do bramki',
        rules: 'Mierzony czas slalomu. Obowiązkowy celny strzał do bramki unihokeja na końcu (powtarzany do skutku). Czas zatrzymywany dopiero po celnym strzale.',
        metric_type: 'time' as MetricType,
        aggregation_type: 'best_attempt' as AggregationType,
        attempts_count: 1,
        sort_order: 2
      },
      {
        event_id: seniorsEvent.id,
        name: 'Rzut piłką lekarską',
        description: 'Rzut piłką lekarską (2 kg K, 3 kg M)',
        rules: '3 próby. Wynik = najdłuższy rzut w metrach.',
        metric_type: 'distance' as MetricType,
        aggregation_type: 'best_attempt' as AggregationType,
        attempts_count: 3,
        sort_order: 3
      },
      {
        event_id: seniorsEvent.id,
        name: 'Rzut lotką',
        description: 'Rzuty lotkami do tarczy',
        rules: '8 rzutów. Suma punktów ze wszystkich rzutów. Przy remisie na miejscach I-III dogrywka (najlepszy z dodatkowych rzutów).',
        metric_type: 'points' as MetricType,
        aggregation_type: 'sum' as AggregationType,
        attempts_count: 8,
        sort_order: 4
      },
      {
        event_id: seniorsEvent.id,
        name: 'Nordic walking ~2,5 km',
        description: 'Marsz z kijkami nordic walking',
        rules: 'Dystans około 2,5 km. Klasyfikacja według czasu. Obowiązek używania kijków przez cały dystans.',
        metric_type: 'time' as MetricType,
        aggregation_type: 'best_attempt' as AggregationType,
        attempts_count: 1,
        sort_order: 5
      },
      {
        event_id: seniorsEvent.id,
        name: 'Bule do świnki',
        description: 'Rzuty kulami do celu (świnki)',
        rules: 'Najmniejsza łączna odległość dwóch najlepszych kul od świnki. Spalone rzuty (oderwanie stóp lub przekroczenie okręgu) = maksymalna odległość.',
        metric_type: 'distance' as MetricType,
        aggregation_type: 'top_n' as AggregationType,
        attempts_count: 4,
        scoring_formula: JSON.stringify({ topN: 2, reverse: true }), // closest wins
        sort_order: 6
      },
      {
        event_id: seniorsEvent.id,
        name: 'Piłeczka palantowa',
        description: 'Rzut piłeczką palantową',
        rules: '3 próby. Liczy się najdłuższy rzut w metrach.',
        metric_type: 'distance' as MetricType,
        aggregation_type: 'best_attempt' as AggregationType,
        attempts_count: 3,
        sort_order: 7
      }
    ];

    await supabase.from('competitions').insert(seniorsCompetitions);

    // 3. OGÓLNOPOLSKIE IGRZYSKA "AKTYWNA WIEŚ"
    const { data: activeVillageEvent, error: activeError } = await supabase
      .from('events')
      .insert({
        name: 'Ogólnopolskie Igrzyska LZS – „Aktywna Wieś" (finał województw)',
        description: `Finał ogólnopolskich igrzysk sportowych "Aktywna Wieś" organizowanych przez LZS.

Uczestnicy: Reprezentacje wszystkich województw Polski. Limit: 40 osób na województwo.

Charakter: Zawody drużynowe i indywidualne w różnych konkurencjach, często nawiązujących do tradycji wiejskich i zawodów rolniczych.

Punktacja generalna województw: Sumowanie punktów ze wszystkich konkurencji według klucza: 1→10 pkt, 2→8, 3→7, 4→6, 5→5, 6→4, 7→3, 8→2, 9+→1 pkt.`,
        location: 'Starzyno, Łebcz, Władysławowo',
        start_date: '2025-09-12',
        end_date: '2025-09-14',
        event_type: 'active_village',
        is_cyclic: true,
        cyclic_month: 9,
        status: 'published',
        max_participants: 640, // 16 województw × 40 osób
        organizer: 'LZS Pomorski',
        contact_email: 'kontakt@lzs-pomorski.pl',
        logo_url: '/lzs-logo.png'
      })
      .select()
      .single();

    if (activeError) throw activeError;

    // Age categories for Active Village
    const activeCategories: Database['public']['Tables']['age_categories']['Insert'][] = [
      { event_id: activeVillageEvent.id, name: 'Open', min_age: 18, max_age: undefined, gender: 'mixed' as Gender },
      { event_id: activeVillageEvent.id, name: 'Seniorzy', min_age: 55, max_age: undefined, gender: 'mixed' as Gender }
    ];

    await supabase.from('age_categories').insert(activeCategories);

    // Active Village competitions
    const activeCompetitions: Database['public']['Tables']['competitions']['Insert'][] = [
      {
        event_id: activeVillageEvent.id,
        name: 'Dojenie krowy na czas',
        description: 'Drużynowe dojenie krowy (symulator)',
        rules: '3-osobowa drużyna. Suma wydojonego mleka = wynik. Mierzony czas: 3 minuty.',
        metric_type: 'count' as MetricType,
        aggregation_type: 'sum' as AggregationType,
        attempts_count: 1,
        is_team_competition: true,
        team_size: 3,
        scoring_formula: JSON.stringify({
          type: 'position_points',
          positions: [
            { position: 1, points: 10 },
            { position: 2, points: 8 },
            { position: 3, points: 7 },
            { position: 4, points: 6 },
            { position: 5, points: 5 },
            { position: 6, points: 4 },
            { position: 7, points: 3 },
            { position: 8, points: 2 },
            { position: 9, points: 1, andAbove: true }
          ]
        }),
        sort_order: 1
      },
      {
        event_id: activeVillageEvent.id,
        name: 'Slalom taczką z ziemniakami',
        description: 'Prowadzenie taczki przez tor slalomowy',
        rules: 'Mierzony czas. Kara +5 sekund za każde przewrócone pachołko. Najmniejszy czas wygrywa.',
        metric_type: 'time' as MetricType,
        aggregation_type: 'best_attempt' as AggregationType,
        attempts_count: 1,
        penalty_rules: JSON.stringify({ knockedCone: 5 }),
        scoring_formula: JSON.stringify({
          type: 'position_points',
          positions: [
            { position: 1, points: 10 },
            { position: 2, points: 8 },
            { position: 3, points: 7 },
            { position: 4, points: 6 },
            { position: 5, points: 5 },
            { position: 6, points: 4 },
            { position: 7, points: 3 },
            { position: 8, points: 2 },
            { position: 9, points: 1, andAbove: true }
          ]
        }),
        sort_order: 2
      },
      {
        event_id: activeVillageEvent.id,
        name: 'Rzut podkową',
        description: 'Rzut podkową do pól punktowych',
        rules: 'Pola punktowe: 3, 7, 20 punktów. Suma punktów z 5 rzutów. Przy remisie dogrywka.',
        metric_type: 'points' as MetricType,
        aggregation_type: 'sum' as AggregationType,
        attempts_count: 5,
        scoring_formula: JSON.stringify({
          type: 'position_points',
          positions: [
            { position: 1, points: 10 },
            { position: 2, points: 8 },
            { position: 3, points: 7 },
            { position: 4, points: 6 },
            { position: 5, points: 5 },
            { position: 6, points: 4 },
            { position: 7, points: 3 },
            { position: 8, points: 2 },
            { position: 9, points: 1, andAbove: true }
          ]
        }),
        sort_order: 3
      },
      {
        event_id: activeVillageEvent.id,
        name: 'Idzie Grześ przez wieś',
        description: 'Przenoszenie worków o różnych wagach',
        rules: 'Drużyna 3-osobowa. Worki: 30 kg, 40 kg, 50 kg. Każda osoba przenosi jeden worek na dystans 20m. Czas całej trójki.',
        metric_type: 'time' as MetricType,
        aggregation_type: 'sum' as AggregationType,
        attempts_count: 1,
        is_team_competition: true,
        team_size: 3,
        scoring_formula: JSON.stringify({
          type: 'position_points',
          positions: [
            { position: 1, points: 10 },
            { position: 2, points: 8 },
            { position: 3, points: 7 },
            { position: 4, points: 6 },
            { position: 5, points: 5 },
            { position: 6, points: 4 },
            { position: 7, points: 3 },
            { position: 8, points: 2 },
            { position: 9, points: 1, andAbove: true }
          ]
        }),
        sort_order: 4
      },
      {
        event_id: activeVillageEvent.id,
        name: 'Rzuty gumowcami',
        description: 'Rzut gumowcem do celu',
        rules: 'Para K+M. Suma najlepszych rzutów obu osób (odległość do celu w metrach).',
        metric_type: 'distance' as MetricType,
        aggregation_type: 'sum' as AggregationType,
        attempts_count: 3,
        is_team_competition: true,
        team_size: 2,
        scoring_formula: JSON.stringify({
          type: 'position_points',
          positions: [
            { position: 1, points: 10 },
            { position: 2, points: 8 },
            { position: 3, points: 7 },
            { position: 4, points: 6 },
            { position: 5, points: 5 },
            { position: 6, points: 4 },
            { position: 7, points: 3 },
            { position: 8, points: 2 },
            { position: 9, points: 1, andAbove: true }
          ]
        }),
        sort_order: 5
      },
      {
        event_id: activeVillageEvent.id,
        name: 'Tenis stołowy seniorów',
        description: 'Turniej tenisa stołowego dla seniorów',
        rules: '2 kategorie wiekowe (55+, 65+), osobno K/M. System pucharowy lub grupowy + finał.',
        metric_type: 'points' as MetricType,
        aggregation_type: 'best_attempt' as AggregationType,
        attempts_count: 1,
        scoring_formula: JSON.stringify({
          type: 'position_points',
          positions: [
            { position: 1, points: 10 },
            { position: 2, points: 8 },
            { position: 3, points: 7 },
            { position: 4, points: 6 },
            { position: 5, points: 5 },
            { position: 6, points: 4 },
            { position: 7, points: 3 },
            { position: 8, points: 2 },
            { position: 9, points: 1, andAbove: true }
          ]
        }),
        sort_order: 6
      },
      {
        event_id: activeVillageEvent.id,
        name: 'Trójbój gospodyń',
        description: 'Trzy konkurencje: ringo, piłka do wiadra, woreczek do hula-hop',
        rules: 'Suma punktów ze wszystkich trzech konkurencji. Każda konkurencja punktowana osobno.',
        metric_type: 'points' as MetricType,
        aggregation_type: 'sum' as AggregationType,
        attempts_count: 3,
        scoring_formula: JSON.stringify({
          type: 'position_points',
          positions: [
            { position: 1, points: 10 },
            { position: 2, points: 8 },
            { position: 3, points: 7 },
            { position: 4, points: 6 },
            { position: 5, points: 5 },
            { position: 6, points: 4 },
            { position: 7, points: 3 },
            { position: 8, points: 2 },
            { position: 9, points: 1, andAbove: true }
          ]
        }),
        sort_order: 7
      },
      {
        event_id: activeVillageEvent.id,
        name: 'Bojówka OSP',
        description: 'Nalewanie wody hydronetką do celu',
        rules: 'Mierzony czas nalewania. +3 sekundy kary za każdy błąd (zalanie terenu, przewrócenie pojemnika).',
        metric_type: 'time' as MetricType,
        aggregation_type: 'best_attempt' as AggregationType,
        attempts_count: 1,
        is_team_competition: true,
        team_size: 4,
        penalty_rules: JSON.stringify({ error: 3 }),
        scoring_formula: JSON.stringify({
          type: 'position_points',
          positions: [
            { position: 1, points: 10 },
            { position: 2, points: 8 },
            { position: 3, points: 7 },
            { position: 4, points: 6 },
            { position: 5, points: 5 },
            { position: 6, points: 4 },
            { position: 7, points: 3 },
            { position: 8, points: 2 },
            { position: 9, points: 1, andAbove: true }
          ]
        }),
        sort_order: 8
      },
      {
        event_id: activeVillageEvent.id,
        name: 'Rzuty woreczkami',
        description: 'Rzut woreczkiem do celu z wyborem odległości',
        rules: 'Wybór odległości: bliska = 1 pkt, średnia = 2 pkt, daleka = 3 pkt. Suma punktów z 5 rzutów.',
        metric_type: 'points' as MetricType,
        aggregation_type: 'sum' as AggregationType,
        attempts_count: 5,
        scoring_formula: JSON.stringify({
          type: 'position_points',
          positions: [
            { position: 1, points: 10 },
            { position: 2, points: 8 },
            { position: 3, points: 7 },
            { position: 4, points: 6 },
            { position: 5, points: 5 },
            { position: 6, points: 4 },
            { position: 7, points: 3 },
            { position: 8, points: 2 },
            { position: 9, points: 1, andAbove: true }
          ]
        }),
        sort_order: 9
      },
      {
        event_id: activeVillageEvent.id,
        name: 'Toczenie koła rowerowego na czas',
        description: 'Toczenie koła rowerowego po wyznaczonej trasie',
        rules: 'Mierzony czas. Koło musi być toczone (nie niesione). Za upuszczenie koła kara +5 sekund.',
        metric_type: 'time' as MetricType,
        aggregation_type: 'best_attempt' as AggregationType,
        attempts_count: 1,
        penalty_rules: JSON.stringify({ drop: 5 }),
        scoring_formula: JSON.stringify({
          type: 'position_points',
          positions: [
            { position: 1, points: 10 },
            { position: 2, points: 8 },
            { position: 3, points: 7 },
            { position: 4, points: 6 },
            { position: 5, points: 5 },
            { position: 6, points: 4 },
            { position: 7, points: 3 },
            { position: 8, points: 2 },
            { position: 9, points: 1, andAbove: true }
          ]
        }),
        sort_order: 10
      }
    ];

    await supabase.from('competitions').insert(activeCompetitions);

    return {
      success: true,
      message: 'Pomyślnie załadowano 3 cykliczne wydarzenia z pełną konfiguracją!'
    };
  } catch (error) {
    console.error('Error seeding events:', error);
    return {
      success: false,
      error
    };
  }
}