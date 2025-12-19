import { LucideIcon, UploadCloud, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ToolCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    to: string;
    color?: string; // e.g. "from-blue-500 to-blue-600"
    lightColor?: string; // e.g. "from-blue-50 to-blue-100"
    isNew?: boolean;
    isPremium?: boolean;
    available?: boolean;
}

export function ToolCard({
    title,
    description,
    icon: Icon,
    to,
    color = "from-primary to-accent",
    lightColor = "from-primary/10 to-accent/10",
    isNew = false,
    isPremium = false,
    available = true,
}: ToolCardProps) {
    return (
        <div className="group card-base overflow-hidden transition-all duration-300 hover:-translate-y-1 relative h-full flex flex-col">
            {!available && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-20 rounded-xl">
                    <div className="text-center p-4 bg-background/90 rounded-lg shadow-lg border border-border">
                        <p className="font-semibold text-foreground">Coming Soon</p>
                        <p className="text-muted-foreground text-sm mt-1">Development in progress</p>
                    </div>
                </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
                {isNew && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                        NEW
                    </span>
                )}
                {isPremium && (
                    <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm flex items-center gap-1">
                        <Lock className="w-3 h-3" /> PRO
                    </span>
                )}
            </div>

            <div
                className={cn(
                    "mb-6 inline-flex rounded-lg bg-gradient-to-br p-4 transition-all duration-200 group-hover:scale-110 w-fit",
                    lightColor
                )}
            >
                <Icon className="h-8 w-8 text-primary" />
            </div>

            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-muted-foreground flex-grow">{description}</p>

            <div className="mt-6">
                <Link
                    to={to}
                    className={cn(
                        "flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-4 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg active:scale-95",
                        available ? color : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                    onClick={(e) => !available && e.preventDefault()}
                >
                    {available ? (
                        <>
                            <UploadCloud className="h-5 w-5" />
                            Open Tool
                        </>
                    ) : (
                        <>
                            <Lock className="h-5 w-5" />
                            Unavailable
                        </>
                    )}
                </Link>
            </div>
        </div>
    );
}
