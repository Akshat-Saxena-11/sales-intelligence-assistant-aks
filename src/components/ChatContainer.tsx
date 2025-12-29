import { useState, useRef, useEffect, useMemo } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { ChatInput } from "./ChatInput";
import { generateSessionId } from "@/lib/session";
import { Message, WebhookPayload } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const WEBHOOK_1 = "https://akshat-n8n-15.app.n8n.cloud/webhook/Akshat-AI-Hackathon-2";
const WEBHOOK_2 = "https://akshat-n8n-15.app.n8n.cloud/webhook-test/Akshat-AI-Hackathon-2";

export function ChatContainer() {
  const sessionId = useMemo(() => generateSessionId(), []);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const sendToWebhooks = async (payload: WebhookPayload): Promise<string> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 min timeout

    try {
      // Send to both webhooks simultaneously, return first successful response
      const results = await Promise.allSettled([
        fetch(WEBHOOK_1, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        }),
        fetch(WEBHOOK_2, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        }),
      ]);

      clearTimeout(timeoutId);

      // Find the first successful response
      for (const result of results) {
        if (result.status === "fulfilled" && result.value.ok) {
          const text = await result.value.text();
          try {
            const json = JSON.parse(text);
            return json.response || json.message || json.output || text;
          } catch {
            return text;
          }
        }
      }

      throw new Error("Both webhooks failed to respond");
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timed out. Please try again.");
      }
      throw error;
    }
  };

  const handleSendMessage = async (content: string) => {
    const timestamp = new Date().toISOString();
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content,
      role: "user",
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

    const payload: WebhookPayload = {
      message: content,
      timestamp,
      sessionId,
    };

    try {
      const response = await sendToWebhooks(payload);
      
      const assistantMessage: Message = {
        id: `msg_${Date.now()}`,
        content: response,
        role: "assistant",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background">
      <ChatHeader />
      
      <ScrollArea className="flex-1 gradient-chat-bg">
        <div className="p-4 space-y-4 min-h-full">
          {messages.length === 0 && !isThinking && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl gradient-primary shadow-soft flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Welcome to Sales Intelligence
              </h2>
              <p className="text-muted-foreground max-w-md">
                Ask me about sales insights, lead analysis, market trends, or any sales-related questions. I'm here to help boost your sales performance.
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isThinking && <ThinkingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <ChatInput onSendMessage={handleSendMessage} disabled={isThinking} />
    </div>
  );
}
