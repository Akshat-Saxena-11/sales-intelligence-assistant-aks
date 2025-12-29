import { Bot } from "lucide-react";

export function ThinkingIndicator() {
  return (
    <div className="flex gap-3 message-enter">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-secondary">
        <Bot className="w-4 h-4 text-secondary-foreground" />
      </div>
      
      <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-assistant-bubble text-assistant-bubble-foreground border border-border shadow-message">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Thinking</span>
          <div className="thinking-dots flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
