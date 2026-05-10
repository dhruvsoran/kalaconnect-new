"use client";

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getChatbotAssistanceAction } from '@/lib/actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type Message = {
    id: number;
    text: string;
    sender: 'user' | 'bot';
};

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! How can I help you get started with कलाConnect today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const result = await getChatbotAssistanceAction({ query: input });
        
        const botMessage: Message = {
            id: Date.now() + 1,
            text: result.response || result.error || "Sorry, something went wrong.",
            sender: 'bot'
        };

        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col">
            <ScrollArea className="flex-grow p-4 -mx-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className={cn("flex items-start gap-3", message.sender === 'user' ? 'justify-end' : '')}>
                            {message.sender === 'bot' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        <Bot className="h-5 w-5" />
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn("rounded-lg px-3 py-2 max-w-[80%]", message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                <p className="text-sm">{message.text}</p>
                            </div>
                             {message.sender === 'user' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                        <User className="h-5 w-5" />
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                             <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    <Bot className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="rounded-lg px-3 py-2 bg-muted flex items-center">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4 border-t">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question..."
                    autoComplete="off"
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
}
