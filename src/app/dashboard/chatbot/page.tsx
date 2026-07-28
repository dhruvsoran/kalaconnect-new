import { ChatInterface } from '@/components/chat-interface';

export default function ChatbotPage() {
    return (
        <div className="h-[calc(100vh-8rem)] overflow-hidden rounded-xl border bg-card shadow-sm">
            <ChatInterface />
        </div>
    );
}
