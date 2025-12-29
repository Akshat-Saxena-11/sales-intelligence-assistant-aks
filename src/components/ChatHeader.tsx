import { Sparkles } from "lucide-react";

export function ChatHeader() {
  return (
    <header className="flex items-center gap-3 p-4 border-b border-border glass">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary shadow-soft">
        <Sparkles className="w-5 h-5 text-primary-foreground" />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          Sales Intelligence Assistant
        </h1>
        <p className="text-sm text-muted-foreground">
          Your AI-powered sales companion
        </p>
      </div>
    </header>
  );
}
