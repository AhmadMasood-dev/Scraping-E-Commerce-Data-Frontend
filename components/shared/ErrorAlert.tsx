import { Badge } from "@/components/ui/badge";

interface ErrorAlertProps {
  title?: string;
  message: string;
  suggestion?: string;
}

export function ErrorAlert({
  title = "Service Unavailable",
  message,
  suggestion = "Ensure Backend Server is Running",
}: ErrorAlertProps) {
  return (
    <div className="max-w-4xl mx-auto bg-destructive/10 border border-destructive/20 rounded-xl p-8 text-center text-destructive">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-4">{message}</p>
      {suggestion && (
        <Badge variant="outline" className="bg-background">
          {suggestion}
        </Badge>
      )}
    </div>
  );
}
