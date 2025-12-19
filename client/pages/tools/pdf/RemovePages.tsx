import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Trash2, ArrowLeft, Upload, X, Download, Loader, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDFDocument } from "pdf-lib";
import { useToast } from "@/hooks/use-toast";

export default function RemovePages() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pagesToRemove, setPagesToRemove] = useState("");
    const [pageCount, setPageCount] = useState(0);

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
        } catch (e) {
            toast({ title: "Error", description: "Failed to load PDF.", variant: "destructive" });
        }
    };

    const handleRemove = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // Parse pages to remove (1-based csv like "1,3,5")
            const pagesStr = pagesToRemove.split(",").map(s => s.trim()).filter(s => s);
            const indicesToRemove = new Set<number>();

            pagesStr.forEach(str => {
                const num = parseInt(str);
                if (!isNaN(num) && num >= 1 && num <= pageCount) {
                    indicesToRemove.add(num - 1); // 0-based
                }
            });

            if (indicesToRemove.size === 0) {
                toast({ title: "No pages selected", description: "Please enter page numbers to remove.", variant: "destructive" });
                setIsProcessing(false);
                return;
            }

            // pdf-lib removePage modifies the doc in place, shifting indices.
            // It's safer to create a new doc and copy valid pages.
            const newDoc = await PDFDocument.create();
            const validIndices = [];
            for (let i = 0; i < pageCount; i++) {
                if (!indicesToRemove.has(i)) {
                    validIndices.push(i);
                }
            }

            if (validIndices.length === 0) {
                toast({ title: "Error", description: "Cannot remove all pages.", variant: "destructive" });
                setIsProcessing(false);
                return;
            }

            const copiedPages = await newDoc.copyPages(pdfDoc, validIndices);
            copiedPages.forEach(p => newDoc.addPage(p));

            const pdfBytes = await newDoc.save();
            downloadPdf(pdfBytes, `cleaned-${file.name}`);

        } catch (e) {
            console.error(e);
            toast({ title: "Failed", description: "Could not remove pages.", variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadPdf = (bytes: Uint8Array, name: string) => {
        const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Success", description: "Pages removed successfully." });
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
                <div className="container-custom flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                            <Trash2 className="h-6 w-6 text-primary-foreground" />
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
                        <h1 className="text-4xl font-bold sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent inline-block">Remove Pages</h1>
                        <p className="mt-2 text-lg text-muted-foreground">Delete unwanted pages from your PDF.</p>
                    </div>

                    {!file ? (
                        <div
                            className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-12 transition-all hover:border-primary/50 hover:bg-muted/50"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110">
                                <Trash2 className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold">Upload PDF</h3>
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
                                <div className="space-y-2">
                                    <Label htmlFor="pages">Pages to Remove</Label>
                                    <Input
                                        id="pages"
                                        type="text"
                                        placeholder="e.g. 1, 3, 5"
                                        value={pagesToRemove}
                                        onChange={(e) => setPagesToRemove(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Comma separated page numbers.
                                    </p>
                                </div>

                                <Button onClick={handleRemove} disabled={isProcessing} className="w-full" size="lg" variant="destructive">
                                    {isProcessing ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Removing...</> : <><Trash2 className="mr-2 h-4 w-4" /> Remove Pages</>}
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
