import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Timer, ArrowLeft, Play, Pause, RotateCcw, Coffee, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PomodoroTimer() {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<"work" | "break">("work"); // work | break

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(interval!);
                        setIsActive(false);
                        // Play notification sound here in future
                        alert(mode === "work" ? "Time for a break!" : "Back to work!");
                        return;
                    }
                    setMinutes(minutes - 1);
                    setSeconds(59);
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            if (interval) clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, seconds, minutes, mode]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        if (mode === "work") {
            setMinutes(25);
        } else {
            setMinutes(5);
        }
        setSeconds(0);
    };

    const switchMode = (newMode: "work" | "break") => {
        setMode(newMode);
        setIsActive(false);
        if (newMode === "work") {
            setMinutes(25);
        } else {
            setMinutes(5);
        }
        setSeconds(0);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
                <div className="container-custom flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                            <Timer className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="hidden text-xl font-bold text-foreground sm:inline">
                            StudentHub
                        </span>
                    </Link>
                    <Link to="/tools" className="btn-ghost flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Back to Tools</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container-custom py-12 sm:py-16">
                <div className="mx-auto max-w-xl text-center">
                    <div className="flex items-center gap-2 mb-4 justify-center">
                        <Badge variant="outline" className="border-primary/20 text-primary">Productivity Booster</Badge>
                    </div>
                    <h1 className="text-4xl font-bold sm:text-5xl mb-6">Pomodoro Timer</h1>

                    <div className="flex justify-center gap-4 mb-10">
                        <Button
                            variant={mode === "work" ? "default" : "outline"}
                            onClick={() => switchMode("work")}
                            className="gap-2"
                        >
                            <Briefcase className="h-4 w-4" /> Work (25m)
                        </Button>
                        <Button
                            variant={mode === "break" ? "default" : "outline"}
                            onClick={() => switchMode("break")}
                            className="gap-2"
                        >
                            <Coffee className="h-4 w-4" /> Break (5m)
                        </Button>
                    </div>

                    <div className="relative mx-auto w-72 h-72 flex items-center justify-center rounded-full border-8 border-muted bg-card shadow-xl mb-10">
                        <div className={`absolute inset-0 rounded-full border-8 ${isActive ? 'border-primary animate-pulse' : 'border-transparent'} transition-all`}></div>
                        <div className="text-6xl font-black tabular-nums tracking-tighter">
                            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <Button size="lg" className="h-14 w-32 text-lg rounded-full" onClick={toggleTimer}>
                            {isActive ? (
                                <><Pause className="mr-2 h-5 w-5" /> Pause</>
                            ) : (
                                <><Play className="mr-2 h-5 w-5 ml-1" /> Start</>
                            )}
                        </Button>
                        <Button size="lg" variant="secondary" className="h-14 w-14 rounded-full p-0" onClick={resetTimer}>
                            <RotateCcw className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="mt-16 text-left rounded-xl border border-border bg-muted/30 p-8">
                        <h3 className="text-lg font-bold mb-4">The Pomodoro Technique</h3>
                        <ul className="space-y-3 text-muted-foreground text-sm">
                            <li className="flex gap-3">
                                <span className="font-bold text-primary">•</span>
                                <span>Work focused for 25 minutes.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-primary">•</span>
                                <span>Take a 5 minute break to stretch or relax.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-primary">•</span>
                                <span>Repeat 4 times, then take a longer 15-30 minute break.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
