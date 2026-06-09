import { ChatInterface } from '@/components/chat-interface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChatbotPage() {
    return (
        <div className="h-[calc(100vh-8rem)] overflow-hidden">
             <Card className="h-full flex flex-col overflow-hidden">
                <CardHeader className="shrink-0">
                    <CardTitle className="font-headline">कलाConnect AI Assistant</CardTitle>
                    <CardDescription>
                        Ask me anything about setting up your shop, marketing your products, or understanding your sales.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col min-h-0 overflow-hidden p-0">
                    <ChatInterface />
                </CardContent>
            </Card>
        </div>
    );
}
