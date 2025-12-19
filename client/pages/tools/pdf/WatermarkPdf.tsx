import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Stamp, ArrowLeft, Upload, X, Download, Loader, FileText, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { useToast } from "@/hooks/use-toast";

export default function WatermarkPdf() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
    const [opacity, setOpacity] = useState(0.5);
    const [size, setSize] = useState(50);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileSelect = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const selectedFile = files[0];
        if (selectedFile.type !== "application/pdf") {
            toast({ title: "Invalid File", description: "Please upload a PDF file.", variant: "destructive" });
            return;
        }
        setFile(selectedFile);
    };

    const handleWatermark = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();
            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            pages.forEach(page => {
                const { width, height } = page.getSize();
                page.drawText(watermarkText, {
                    x: width / 2 - (width / 4), // Rough centering
                    y: height / 2,
                    size: size,
                    font: font,
                    color: rgb(0.75, 0.75, 0.75), // Gray
                    opacity: opacity,
                    rotate: degrees(45),
                });
            });

            const pdfBytes = await pdfDoc.save();
            downloadPdf(pdfBytes, `watermarked-${file.name}`);

        } catch (e) {
            console.error(e);
            toast({ title: "Failed", description: "Could not add watermark.", variant: "destructive" });
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
        toast({ title: "Success", description: "Watermark added successfully." });
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
                <div className="container-custom flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                            <Stamp className="h-6 w-6 text-primary-foreground" />
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
                        <h1 className="text-4xl font-bold sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent inline-block">Add Watermark</h1>
                        <p className="mt-2 text-lg text-muted-foreground">Stamp text over your PDF pages.</p>
                    </div>

                    {!file ? (
                        <div
                            className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-12 transition-all hover:border-primary/50 hover:bg-muted/50"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110">
                                <Stamp className="h-8 w-8 text-primary" />
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
                                        <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="text">Watermark Text</Label>
                                    <Input
                                        id="text"
                                        type="text"
                                        placeholder="CONFIDENTIAL"
                                        value={watermarkText}
                                        onChange={(e) => setWatermarkText(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="size">Size</Label>
                                        <Input
                                            id="size"
                                            type="number"
                                            value={size}
                                            onChange={(e) => setSize(Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="opacity">Opacity (0-1)</Label>
                                        <Input
                                            id="opacity"
                                            type="number"
                                            step="0.1"
                                            max="1"
                                            min="0"
                                            value={opacity}
                                            onChange={(e) => setOpacity(Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <Button onClick={handleWatermark} disabled={isProcessing} className="w-full" size="lg">
                                    {isProcessing ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Stamping...</> : <><Stamp className="mr-2 h-4 w-4" /> Add Watermark</>}
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
