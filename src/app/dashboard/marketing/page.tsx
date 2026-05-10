import { MarketingContentForm } from "@/components/marketing-content-form";

export default function MarketingPage() {
    return (
        <div className="grid flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold font-headline tracking-tight sm:grow-0">
                    AI Marketing Assistant
                </h1>
            </div>
            <MarketingContentForm />
        </div>
    );
}
