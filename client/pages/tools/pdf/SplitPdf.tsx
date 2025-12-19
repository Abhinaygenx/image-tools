import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Scissors, ArrowLeft, Upload, X, Download, Loader, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDFDocument } from "pdf-lib";
import { useToast } from "@/hooks/use-toast";

export default function SplitPdf() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [splitMode, setSplitMode] = useState<"range" | "extract">("range"); // range (e.g. 1-5), extract (all pages)
    const [rangeStart, setRangeStart] = useState(1);
    const [rangeEnd, setRangeEnd] = useState(1);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const selectedFile = files[0];

        if (selectedFile.type !== "application/pdf") {
            toast({ title: "Invalid File", description: "Please upload a PDF file.", variant: "destructive" });
            return;
        }

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            setPageCount(pdfDoc.getPageCount());
            setFile(selectedFile);
            setRangeEnd(pdfDoc.getPageCount());
        } catch (e) {
            toast({ title: "Error", description: "Failed to load PDF.", variant: "destructive" });
        }
    };

    const handleSplit = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const srcDoc = await PDFDocument.load(arrayBuffer);
            const newDoc = await PDFDocument.create();

            if (splitMode === "range") {
                // Validate range
                const start = Math.max(1, Math.min(rangeStart, pageCount));
                const end = Math.max(start, Math.min(rangeEnd, pageCount));

                // Indices are 0-based
                const indices = [];
                for (let i = start - 1; i < end; i++) {
                    indices.push(i);
                }

                const copiedPages = await newDoc.copyPages(srcDoc, indices);
                copiedPages.forEach((page) => newDoc.addPage(page));

                const pdfBytes = await newDoc.save();
                downloadPdf(pdfBytes, `split-${start}-${end}-${file.name}`);
            } else {
                // Extract all pages as separate files? Or just extract one single page?
                // "Extract" usually means taking specific pages out.
                // For simplify, let's say "Separate all pages" into a ZIP requires JSZip.
                // Let's implement simpler "Extract Single Page" for now or just the Range is powerful enough.
                // Actually, "Split" often implies breaking it into pieces.
                // Let's stick to Range for MVP as it covers most "Extract" needs.
                toast({ title: "Info", description: "Advanced extraction coming soon. Using Range mode." });
            }

        } catch (e) {
            console.error(e);
            toast({ title: "Failed", description: "Could not split PDF.", variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadPdf = (bytes: Uint8Array, name: string) => {
        const blob = new Blob([bytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Success", description: "PDF ready for download." });
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
                <div className="container-custom flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                            <Scissors className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="hidden text-xl font-bold text-foreground sm:inline">StudentHub</span>
                    </Link>
                    <Link to="/tools" className="btn-ghost flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Back to Tools</span>
                    </Link>
                </div>
            </header>

            <main className="container-custom py-12 sm:py-16">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-8 text-center sm:text-left">
                        <h1 className="text-4xl font-bold sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent inline-block">Split PDF</h1>
                        <p className="mt-2 text-lg text-muted-foreground">Extract pages or split your document into smaller parts.</p>
                    </div>

                    {!file ? (
                        <div
                            className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-12 transition-all hover:border-primary/50 hover:bg-muted/50"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110">
                                <Scissors className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold">Upload PDF to Split</h3>
                            <p className="mt-2 text-center text-muted-foreground">Drag and drop, or click to browse.</p>
                            <Button onClick={() => fileInputRef.current?.click()} className="mt-6" size="lg">Select PDF</Button>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-red-100 text-red-600 rounded flex items-center justify-center">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                                        <p className="text-sm text-muted-foreground">{pageCount} Pages</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <Label>Select Page Range</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="start" className="text-xs text-muted-foreground">From Page</Label>
                                            <Input
                                                id="start"
                                                type="number"
                                                min={1}
                                                max={pageCount}
                                                value={rangeStart}
                                                onChange={(e) => setRangeStart(parseInt(e.target.value) || 1)}
                                            />
                                        </div>
                                        <span className="mt-5 font-bold text-muted-foreground mx-2">-</span>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="end" className="text-xs text-muted-foreground">To Page</Label>
                                            <Input
                                                id="end"
                                                type="number"
                                                min={1}
                                                max={pageCount}
                                                value={rangeEnd}
                                                onChange={(e) => setRangeEnd(parseInt(e.target.value) || 1)}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        This will create a new PDF containing only pages {rangeStart} through {rangeEnd}.
                                    </p>
                                </div>

                                <Button onClick={handleSplit} disabled={isProcessing} className="w-full" size="lg">
                                    {isProcessing ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Splitting...</> : <><Download className="mr-2 h-4 w-4" /> Download Split PDF</>}
                                </Button>
                            </div>
                        </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="application/pdf" onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />
                </div>
            </main>
        </div>
    );
}
