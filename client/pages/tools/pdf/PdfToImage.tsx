import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowLeft, Upload, X, Download, Loader, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as pdfjsLib from "pdfjs-dist";

// Worker configuration for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfToImage() {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [numPages, setNumPages] = useState(0);
    const [convertedImages, setConvertedImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;

        const selectedFile = files[0];

        if (selectedFile.type !== "application/pdf") {
            setError("Please select a valid PDF file");
            return;
        }

        setFile(selectedFile);
        setConvertedImages([]);
        setNumPages(0);
        setError(null);
    };

    const handleConvert = async () => {
        if (!file) return;

        setIsConverting(true);
        setConvertedImages([]);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            setNumPages(pdf.numPages);

            const images: string[] = [];

            // Limit to first 10 pages for demo/performance to prevent freezing main thread too long
            const pagesToConvert = Math.min(pdf.numPages, 10);

            for (let i = 1; i <= pagesToConvert; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 }); // High quality

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    await page.render({ canvasContext: context, viewport: viewport }).promise;
                    images.push(canvas.toDataURL("image/jpeg"));
                }
            }

            setConvertedImages(images);

        } catch (err) {
            console.error(err);
            setError("Failed to process PDF. It might be password protected or corrupted.");
        } finally {
            setIsConverting(false);
        }
    };

    const handleDownload = (dataUrl: string, index: number) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `page-${index + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-background pb-20">

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
                <div className="container-custom flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                            <FileText className="h-6 w-6 text-primary-foreground" />
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
                <div className="mx-auto max-w-2xl">
                    <div className="mb-8 text-center sm:text-left">
                        <div className="flex items-center gap-2 mb-2 justify-center sm:justify-start">
                            {/* <Badge>New</Badge> */}
                        </div>
                        <h1 className="text-4xl font-bold sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent inline-block">PDF to Image</h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Convert PDF pages into high-quality JPG images.
                        </p>
                    </div>

                    {/* Upload Area */}
                    {!file ? (
                        <div
                            className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-12 transition-all hover:border-primary/50 hover:bg-muted/50"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110">
                                <Upload className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold">Upload PDF Document</h3>
                            <p className="mt-2 text-center text-muted-foreground">
                                Drag and drop, or click to browse.
                            </p>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-6"
                                size="lg"
                            >
                                Select PDF
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-red-100 text-red-600 rounded flex items-center justify-center">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                                        <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            {!convertedImages.length && (
                                <Button
                                    onClick={handleConvert}
                                    disabled={isConverting}
                                    className="w-full h-12 text-lg"
                                    size="lg"
                                >
                                    {isConverting ? (
                                        <>
                                            <Loader className="h-5 w-5 mr-2 animate-spin" /> Converting Pages...
                                        </>
                                    ) : (
                                        <>
                                            <ImageIcon className="h-5 w-5 mr-2" /> Convert to JPG
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileSelect(e.target.files)}
                        className="hidden"
                    />

                    {/* Error Message */}
                    {error && (
                        <div className="mt-6 flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive animate-in fade-in slide-in-from-top-2">
                            <div className="flex-1 font-medium">{error}</div>
                        </div>
                    )}

                    {/* Results Grid */}
                    {convertedImages.length > 0 && (
                        <div className="mt-10 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-xl font-bold mb-4">Converted Pages ({convertedImages.length})</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {convertedImages.map((img, index) => (
                                    <div key={index} className="border border-border rounded-lg overflow-hidden bg-white shadow-sm">
                                        <img src={img} alt={`Page ${index + 1}`} className="w-full h-auto object-contain" />
                                        <div className="p-3 bg-muted/30 border-t border-border flex justify-between items-center">
                                            <span className="text-sm font-medium">Page {index + 1}</span>
                                            <Button size="sm" variant="outline" onClick={() => handleDownload(img, index)}>
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {numPages > 10 && (
                                <p className="mt-6 text-center text-muted-foreground text-sm">
                                    * Only first 10 pages shown in this demo version.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
