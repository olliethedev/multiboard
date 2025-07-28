import { Footer } from "@/components/footer";

interface PostGridWrapperProps {
    title: React.ReactNode;
    description: React.ReactNode;
    actions?: React.ReactNode;
    children: React.ReactNode;
}


export function PostGridWrapper({ title, description, actions, children }: PostGridWrapperProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1">
                <div className="container mx-auto py-8 px-6">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
                            <p className="text-muted-foreground mt-2">
                                {description}
                            </p>
                        </div>
                        {actions}
                    </div>
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    );
}