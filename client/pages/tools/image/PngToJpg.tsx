import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Image, ArrowLeft, Upload, X, Download, Loader, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PngToJpg() {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;

        const selectedFile = files[0];

        if (!selectedFile.type.match("image/png")) {
            setError("Please select a valid PNG image");
            return;
        }

        if (selectedFile.size > 20 * 1024 * 1024) {
            setError("File is larger than 20MB");
            return;
        }

        setFile(selectedFile);
        setError(null);
        setSuccess(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleFileSelect(e.dataTransfer.files);
    };

    const handleConvert = async () => {
        if (!file) return;

        setIsConverting(true);
        setError(null);

        try {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            const canvas = canvasRef.current;
            if (!canvas) throw new Error("Canvas not initialized");

            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Could not get canvas context");

            // Fill background with white since JPG doesn't support transparency
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(img, 0, 0);

            const jpgUrl = canvas.toDataURL("image/jpeg", 0.9); // 0.9 quality

            const link = document.createElement("a");
            link.href = jpgUrl;
            link.download = file.name.replace(/\.png$/i, ".jpg");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setFile(null);
            }, 3000);

        } catch (err) {
            setError("Failed to convert image. Please try again.");
            console.error(err);
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <canvas ref={canvasRef} className="hidden" />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
                <div className="container-custom flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                            <FileImage className="h-6 w-6 text-primary-foreground" />
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
                        <h1 className="text-4xl font-bold sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent inline-block">PNG to JPG Converter</h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Convert PNG images to JPG format for smaller file sizes.
                        </p>
                    </div>

                    {/* Upload Area */}
                    <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-12 transition-all hover:border-primary/50 hover:bg-muted/50"
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110">
                            <Image className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold">Upload PNG Image</h3>
                        <p className="mt-2 text-center text-muted-foreground">
                            Drag and drop your image here, or click to browse.
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground/50">
                            Max 20MB
                        </p>
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-6"
                            size="lg"
                        >
                            Select PNG File
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png"
                            onChange={(e) => handleFileSelect(e.target.files)}
                            className="hidden"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-6 flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive animate-in fade-in slide-in-from-top-2">
                            <div className="flex-1 font-medium">{error}</div>
                            <button onClick={() => setError(null)}>
                                <X className="h-5 w-5 opacity-70 hover:opacity-100" />
                            </button>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mt-6 flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-700 animate-in fade-in slide-in-from-top-2">
                            <div className="flex-1 font-medium">✓ Image converted successfully!</div>
                        </div>
                    )}

                    {/* File Info */}
                    {file && (
                        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Selected Image</h3>
                                <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <X className="h-4 w-4 mr-2" /> Clear
                                </Button>
                            </div>

                            <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
                                <div className="relative h-16 w-16 overflow-hidden rounded-md border border-border">
                                    <img src={URL.createObjectURL(file)} alt="Preview" className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{file.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>

                            <Button
                                onClick={handleConvert}
                                disabled={isConverting}
                                className="w-full mt-6 h-12 text-lg"
                                size="lg"
                            >
                                {isConverting ? (
                                    <>
                                        <Loader className="h-5 w-5 mr-2 animate-spin" /> Converting...
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-5 w-5 mr-2" /> Convert to JPG
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Info Section */}
                    <div className="mt-16 rounded-xl border border-border bg-muted/30 p-8">
                        <h3 className="text-lg font-bold mb-4">How it works</h3>
                        <ul className="space-y-4 text-muted-foreground">
                            <li className="flex gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">1</div>
                                <span>Upload your PNG image file.</span>
                            </li>
                            <li className="flex gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">2</div>
                                <span>The conversion happens securely in your browser.</span>
                            </li>
                            <li className="flex gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">3</div>
                                <span>Download the optimized JPG file instantly.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
