
export function SiteFooter() {
    return (
        <footer className="bg-card border-t">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} कलाConnect. All rights reserved.</p>
                <p className="text-sm mt-2">Developed by Dhruv Soran</p>
            </div>
        </footer>
    );
}
