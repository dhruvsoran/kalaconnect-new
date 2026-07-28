"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Send, User, Loader2, Mic, MicOff, Volume2, VolumeX, Trash2, ChevronDown, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getChatbotAssistanceAction } from '@/lib/actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
};

const STORAGE_KEY = 'kalaconnect_chat_history';

const SUGGESTIONS = [
  'How do I set up my shop?',
  'Tips for photographing my art',
  'How to price my products?',
  'Best marketing strategies for artisans',
];

function loadMessages(): Message[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [];
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 150);
  }, []);

  const speakText = useCallback((text: string) => {
    if (!synthRef.current || !autoSpeak) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    synthRef.current.speak(utterance);
  }, [autoSpeak]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  }, []);

  const toggleAutoSpeak = useCallback(() => {
    setAutoSpeak(prev => {
      if (prev) stopSpeaking();
      return !prev;
    });
  }, [stopSpeaking]);

  const clearChat = useCallback(() => {
    stopSpeaking();
    setMessages([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    if (inputRef.current) inputRef.current.focus();
  }, [stopSpeaking]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoadingRef.current) return;

    const userMessage: Message = { id: Date.now(), text: text.trim(), sender: 'user', timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await getChatbotAssistanceAction({ query: text.trim() });
      const botMessage: Message = {
        id: Date.now() + 1,
        text: result.response || result.error || "Sorry, something went wrong.",
        sender: 'bot',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, botMessage]);
      speakText(botMessage.text);
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, something went wrong. Please try again.", sender: 'bot', timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  }, [speakText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden bg-gradient-to-b from-background to-muted/30">
      <div className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3 px-4 py-3">
          <Avatar className="h-9 w-9 ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">AI Assistant</h3>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">Ask me anything about your shop</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleAutoSpeak}
              className={cn("h-8 w-8", autoSpeak && "text-primary")}
              aria-label={autoSpeak ? "Mute voice" : "Enable voice"}
            >
              {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            {hasMessages && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearChat}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                aria-label="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto min-h-0 scroll-smooth relative"
      >
        {!hasMessages && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full px-6 py-8">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold font-headline mb-1">How can I help you?</h2>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
              Get instant help with setting up your shop, marketing your products, or understanding your sales.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {SUGGESTIONS.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  className="text-xs h-auto py-2.5 justify-start text-left whitespace-normal"
                  onClick={() => sendMessage(suggestion)}
                  disabled={isLoading}
                >
                  <Sparkles className="h-3 w-3 mr-2 shrink-0 text-primary" />
                  <span className="line-clamp-2">{suggestion}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-1">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => {
                const prevMessage = index > 0 ? messages[index - 1] : null;
                const isSameSender = prevMessage?.sender === message.sender;
                const showTimestamp = !isSameSender ||
                  (message.timestamp - (prevMessage?.timestamp || 0)) > 300000;

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    {showTimestamp && (
                      <div className="flex items-center gap-2 py-2">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-[10px] text-muted-foreground/60 font-medium">
                          {formatTime(message.timestamp)}
                        </span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                    )}
                    <div className={cn(
                      "flex items-start gap-3 px-1 py-1.5",
                      message.sender === 'user' && "flex-row-reverse"
                    )}>
                      <Avatar className={cn(
                        "h-8 w-8 shrink-0 ring-2 ring-background",
                        message.sender === 'user' ? "ring-primary/10" : "ring-primary/20"
                      )}>
                        <AvatarFallback className={cn(
                          message.sender === 'bot'
                            ? "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground"
                            : "bg-muted"
                        )}>
                          {message.sender === 'bot' ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "rounded-2xl px-4 py-2.5 max-w-[80%]",
                        message.sender === 'user'
                          ? "bg-primary text-primary-foreground rounded-tr-md"
                          : "bg-muted/80 border rounded-tl-md"
                      )}>
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                          {message.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 px-1 py-1.5"
              >
                <Avatar className="h-8 w-8 shrink-0 ring-2 ring-primary/20 ring-background">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl px-4 py-3 bg-muted/80 border rounded-tl-md">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        )}

        <AnimatePresence>
          {showScrollBtn && hasMessages && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
            >
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full shadow-lg"
                onClick={() => scrollToBottom(true)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3">
        <form onSubmit={handleSubmit} className="flex items-end gap-2 max-w-4xl mx-auto">
          <Button
            type="button"
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            onClick={isListening ? stopListening : startListening}
            disabled={isLoading}
            className={cn(
              "h-10 w-10 shrink-0 rounded-full transition-colors",
              isListening && "animate-pulse"
            )}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Type your question..."}
              autoComplete="off"
              disabled={isLoading}
              className={cn(
                "pr-12 rounded-2xl bg-muted/50 border-muted-foreground/20",
                "focus-visible:ring-primary/30 focus-visible:border-primary/30",
                "transition-all duration-200",
                isListening && "border-destructive/50 ring-destructive/20"
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-10 w-10 shrink-0 rounded-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
