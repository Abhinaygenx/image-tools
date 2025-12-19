import { useState, useRef, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, X, Loader, FileText, CheckCircle, AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LucideIcon } from "lucide-react";

interface BaseToolProps {
    title: string;
    description: string;
    icon: LucideIcon;
    acceptedFileTypes: Record<string, string[]>; // e.g., { 'application/pdf': ['.pdf'] }
    fileLabel?: string;
    actionLabel: string;
    processingLabel?: string;
    onProcess: (file: File) => Promise<Uint8Array | Blob | null | void>; // Returns the processed file bytes or nothing if handled internally
    downloadNamePrefix?: string;
    outputExtension?: string;
    iconColorClass?: string;
}

export default function BaseTool({
    title,
    description,
    icon: Icon,
    acceptedFileTypes,
    fileLabel = "Select File",
    actionLabel,
    processingLabel = "Processing...",
    onProcess,
    downloadNamePrefix = "output",
    outputExtension = "pdf",
    iconColorClass = "text-primary",
}: BaseToolProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileSelect = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const selectedFile = files[0];
        // Basic type check - enhanced validation could check mime types against acceptedFileTypes
        // For now we trust the input accept attribute for the UI
        setFile(selectedFile);
    };

    const handleAction = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const result = await onProcess(file);

            // If the onProcess returns bytes/blob, we handle download here. 
            // If it returns null/void, we assume it handled the download itself or displayed a result.
            if (result) {
                const blob = result instanceof Blob ? result : new Blob([result as any]);
                // Note: mime type should ideally be passed or inferred. 
                // For now defaulting to generic or let browser infer.

                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${downloadNamePrefix}-${file.name.split('.')[0]}.${outputExtension}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                toast({ title: "Success", description: "File processed successfully." });
            }
        } catch (e: any) {
            console.error(e);
            toast({ title: "Error", description: e.message || "Something went wrong.", variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
    };

    // Convert acceptedFileTypes object to comma string for input strictness
    const acceptString = Object.values(acceptedFileTypes).flat().join(",");

    return (
        <div className="min-h-screen bg-background pb-20">
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
                <div className="container-custom flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                            <Icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="hidden text-xl font-bold text-foreground sm:inline">StudentHub</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="btn-ghost flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                        <Link to="/tools" className="btn-ghost flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Back to Tools</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container-custom py-12 sm:py-16">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-8 text-center sm:text-left">
                        <h1 className="text-4xl font-bold sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent inline-block">{title}</h1>
                        <p className="mt-2 text-lg text-muted-foreground">{description}</p>
                    </div>

                    {!file ? (
                        <div
                            className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-12 transition-all hover:border-primary/50 hover:bg-muted/50"
                        >
                            <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110`}>
                                <Icon className={`h-8 w-8 ${iconColorClass}`} />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold">Upload File</h3>
                            <p className="mt-2 text-center text-muted-foreground">Drag and drop, or click to browse.</p>
                            <Button onClick={() => fileInputRef.current?.click()} className="mt-6" size="lg">{fileLabel}</Button>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/10 text-primary rounded flex items-center justify-center">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                                        <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <Button onClick={handleAction} disabled={isProcessing} className="w-full" size="lg">
                                    {isProcessing ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> {processingLabel}</> : <><CheckCircle className="mr-2 h-4 w-4" /> {actionLabel}</>}
                                </Button>
                                <p className="text-xs text-center text-muted-foreground">
                                    Files are processed locally in your browser for privacy.
                                </p>
                            </div>
                        </div>
                    )}
                    <input ref={fileInputRef} type="file" accept={acceptString} onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />
                </div>
            </main>
        </div>
    );
}
