import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, UsersIcon, TrophyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompetitionCardProps {
  title: string;
  description: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants: number;
  status: 'active' | 'pending' | 'completed';
  competitions: string[];
  onViewDetails: () => void;
}

const statusConfig = {
  active: {
    label: "Aktywne",
    className: "bg-competition-active text-white",
  },
  pending: {
    label: "Oczekujące",
    className: "bg-competition-pending text-white",
  },
  completed: {
    label: "Zakończone", 
    className: "bg-competition-completed text-white",
  },
};

export function CompetitionCard({
  title,
  description,
  date,
  location,
  participants,
  maxParticipants,
  status,
  competitions,
  onViewDetails,
}: CompetitionCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <Card className="hover:shadow-elegant transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {title}
            </CardTitle>
            <CardDescription className="text-sm">
              {description}
            </CardDescription>
          </div>
          <Badge className={cn("text-xs font-medium", statusInfo.className)}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPinIcon className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <UsersIcon className="h-4 w-4" />
            <span>{participants}/{maxParticipants}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrophyIcon className="h-4 w-4" />
            <span>{competitions.length} konkurencji</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Konkurencje:</p>
          <div className="flex flex-wrap gap-1">
            {competitions.map((competition, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {competition}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button 
            onClick={onViewDetails} 
            variant="competition" 
            className="w-full"
          >
            Zobacz szczegóły
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}