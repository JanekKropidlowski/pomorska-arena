import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface RoleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  buttonVariant?: "default" | "competition" | "judge" | "outline";
  onAction: () => void;
}

export function RoleCard({
  title,
  description,
  icon: Icon,
  buttonText,
  buttonVariant = "default",
  onAction,
}: RoleCardProps) {
  return (
    <Card className="hover:shadow-elegant transition-all duration-300 animate-slide-up group">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle className="text-lg font-semibold">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-center">
        <Button 
          onClick={onAction} 
          variant={buttonVariant}
          className="w-full"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}