import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Video, ArrowLeft, Upload, X, Download, Loader, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Mp4ToMp3() {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;

        const selectedFile = files[0];

        if (!selectedFile.type.match("video/mp4")) {
            setError("Please select a valid MP4 video");
            return;
        }

        if (selectedFile.size > 50 * 1024 * 1024) {
            setError("File is larger than 50MB");
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

        // Mock conversion for UI demo
        setTimeout(() => {
            setIsConverting(false);
            setSuccess(true);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
                <div className="container-custom flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                            <Music className="h-6 w-6 text-primary-foreground" />
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
                            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">Beta</Badge>
                        </div>
                        <h1 className="text-4xl font-bold sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent inline-block">MP4 to MP3 Converter</h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Extract audio implementation from video files.
                        </p>
                    </div>

                    {/* Upload Area */}
                    <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-12 transition-all hover:border-primary/50 hover:bg-muted/50"
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110">
                            <Video className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold">Upload MP4 Video</h3>
                        <p className="mt-2 text-center text-muted-foreground">
                            Drag and drop your video here, or click to browse.
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground/50">
                            Max 50MB
                        </p>
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-6"
                            size="lg"
                        >
                            Select MP4 File
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/mp4"
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
                            <div className="flex-1 font-medium">✓ Audio extracted successfully! (Demo)</div>
                        </div>
                    )}

                    {/* File Info */}
                    {file && (
                        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Selected Video</h3>
                                <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <X className="h-4 w-4 mr-2" /> Clear
                                </Button>
                            </div>

                            <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
                                <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted">
                                    <Video className="h-8 w-8 text-muted-foreground" />
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
                                        <Loader className="h-5 w-5 mr-2 animate-spin" /> Extracting Audio...
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-5 w-5 mr-2" /> Convert to MP3
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
                                <span>Upload your MP4 video file.</span>
                            </li>
                            <li className="flex gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">2</div>
                                <span>We extract the audio track from your video.</span>
                            </li>
                            <li className="flex gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">3</div>
                                <span>Download the MP3 audio file.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
