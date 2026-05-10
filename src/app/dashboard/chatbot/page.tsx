import { ChatInterface } from '@/components/chat-interface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChatbotPage() {
    return (
        <div className="h-[calc(100vh-8rem)]">
             <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle className="font-headline">कलाConnect AI Assistant</CardTitle>
                    <CardDescription>
                        Ask me anything about setting up your shop, marketing your products, or understanding your sales.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                    <ChatInterface />
                </CardContent>
            </Card>
        </div>
    );
}
