import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, ArrowLeft, Sparkles, Copy, Trash2, Loader2, Lock, Home } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function TextSummarizer() {
    const [inputText, setInputText] = useState("");
    const [summary, setSummary] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // Use global auth state
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();

    const credits = user?.credits ?? 0;
    const isPro = user?.isPro ?? false;

    const handleSummarize = async () => {
        if (!inputText.trim()) {
            toast.error("Please enter some text to summarize.");
            return;
        }

        // Pro users have unlimited (or high) credits, Free users limited
        if (!isPro && credits <= 0) {
            setShowUpgradeModal(true);
            return;
        }

        setIsLoading(true);

        // Mock AI delay
        setTimeout(() => {
            const mockSummary = "✨ AI Summary:\n\n" +
                inputText.split(" ").slice(0, Math.min(inputText.split(" ").length, 20)).join(" ") +
                "... [Summary truncated for demo]";

            setSummary(mockSummary);

            // Deduct credit globally (Mock update for now until DB real)
            // In real app: call API to deduct credit
            toast.success("Summary generated!");
            setIsLoading(false);
        }, 1500);
    };

    const copyToClipboard = () => {
        if (!summary) return;
        navigator.clipboard.writeText(summary);
        toast("Copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Upgrade Modal */}
            <AlertDialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Out of Credits</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have used all your free AI credits for today. Upgrade to Pro for unlimited access and premium features.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => navigate("/pricing")}>Upgrade to Pro</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
                <div className="container-custom flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600">
                            <BrainCircuit className="h-6 w-6 text-white" />
                        </div>
                        <span className="hidden text-xl font-bold text-foreground sm:inline">
                            AI Summarizer
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        {!isPro && (
                            <Badge variant="secondary" className="hidden sm:flex items-center gap-1 font-mono cursor-pointer" onClick={() => navigate("/pricing")}>
                                <Sparkles className="h-3 w-3 text-violet-500" />
                                {credits} Credits Left
                            </Badge>
                        )}
                        {isPro && (
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">PRO</Badge>
                        )}
                        <Link to="/" className="btn-ghost flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                        <Link to="/tools" className="btn-ghost flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Back</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container-custom py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)] min-h-[600px]">
                    {/* Input Section */}
                    <div className="flex flex-col gap-4">
                        <Card className="flex-1 flex flex-col border-violet-500/20 shadow-lg shadow-violet-500/5">
                            <CardHeader>
                                <CardTitle>Input Text</CardTitle>
                                <CardDescription>Paste your article, notes, or essay here.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 p-4 pt-0">
                                <Textarea
                                    className="h-full resize-none text-base leading-relaxed p-4"
                                    placeholder="Paste your text here to summarize..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                />
                            </CardContent>
                        </Card>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="ghost"
                                onClick={() => setInputText("")}
                                disabled={isLoading || !inputText}
                            >
                                <Trash2 className="h-4 w-4 mr-2" /> Clear
                            </Button>
                            <Button
                                onClick={handleSummarize}
                                disabled={isLoading || !inputText}
                                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white min-w-[140px]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Summarizing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4 mr-2" /> Summarize
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Output Section */}
                    <Card className="flex-1 flex flex-col bg-muted/30 border-dashed">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-violet-600">AI Summary</CardTitle>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={copyToClipboard}
                                disabled={!summary}
                            >
                                <Copy className="h-4 w-4 mr-2" /> Copy
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1 p-6 pt-0">
                            {summary ? (
                                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none animate-in fade-in-50">
                                    <p className="whitespace-pre-wrap">{summary}</p>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                    <BrainCircuit className="h-16 w-16 mb-4" />
                                    <p>Summary will appear here</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
