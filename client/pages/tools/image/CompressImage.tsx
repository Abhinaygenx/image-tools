import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Image, ArrowLeft, Upload, X, Download, Loader, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

export default function CompressImage() {
    const [file, setFile] = useState<File | null>(null);
    const [compressedFile, setCompressedFile] = useState<Blob | null>(null);
    const [quality, setQuality] = useState([80]);
    const [isCompressing, setIsCompressing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;

        const selectedFile = files[0];

        if (!selectedFile.type.match(/image\/(jpeg|png|webp)/)) {
            setError("Please select a valid JPG, PNG, or WebP image");
            return;
        }

        if (selectedFile.size > 20 * 1024 * 1024) {
            setError("File is larger than 20MB");
            return;
        }

        setFile(selectedFile);
        setCompressedFile(null);
        setError(null);
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

    // Re-run compression when quality changes
    useEffect(() => {
        if (file) {
            compressImage(file, quality[0] / 100);
        }
    }, [file, quality]);

    const compressImage = async (originalFile: File, qualityFactor: number) => {
        setIsCompressing(true);
        try {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(originalFile);

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            const canvas = canvasRef.current;
            if (!canvas) return;

            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Draw background white for transparency handling (optional, mostly for converting transparent PNGs to JPG)
            // but here we keep format if possible or fallback. 
            // Simplified: always re-encode as JPEG for max compression or maintain type.
            // Let's stick to the file type if supported, else JPEG.

            ctx.drawImage(img, 0, 0);

            // Simple compression logic
            let outputType = originalFile.type;
            if (outputType === 'image/png') {
                // PNG compression in canvas is not quality-adjustable in standard toDataURL params mostly.
                // Often people convert to JPEG/WEBP for compression.
                // Let's offer WEBP for modern or JPEG fallback.
                // For this tool, let's force JPEG/WEBP if the user wants compression success visible.
                // Or try 'image/jpeg' if they want size reduction.
                // Let's use 'image/jpeg' for better compression visualization here.
                outputType = 'image/jpeg';
            }

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        setCompressedFile(blob);
                    }
                    setIsCompressing(false);
                },
                outputType,
                qualityFactor
            );

        } catch (err) {
            console.error(err);
            setError("Compression failed");
            setIsCompressing(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleDownload = () => {
        if (!compressedFile || !file) return;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(compressedFile);
        // Add -compressed suffix
        const nameParts = file.name.split(".");
        const ext = nameParts.pop();
        const name = nameParts.join(".");
        // If we forced JPEG, change extension
        const finalExt = "jpg"; // since we used image/jpeg above
        link.download = `${name}-compressed.${finalExt}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <canvas ref={canvasRef} className="hidden" />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
                <div className="container-custom flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                            <Image className="h-6 w-6 text-primary-foreground" />
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
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">Pro</Badge>
                        </div>
                        <h1 className="text-4xl font-bold sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent inline-block">Image Compressor</h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Reduce image file size without significant quality loss.
                        </p>
                    </div>

                    {/* Upload Area */}
                    <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-12 transition-all hover:border-primary/50 hover:bg-muted/50"
                    >
                        {!file ? (
                            <>
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110">
                                    <Upload className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="mt-4 text-xl font-semibold">Upload Image</h3>
                                <p className="mt-2 text-center text-muted-foreground">
                                    JPG, PNG, or WebP. Max 20MB.
                                </p>
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mt-6"
                                    size="lg"
                                >
                                    Select Image
                                </Button>
                            </>
                        ) : (
                            <div className="w-full">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-16 w-16 overflow-hidden rounded-md border border-border">
                                            <img src={URL.createObjectURL(file)} alt="Preview" className="h-full w-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                                            <p className="text-sm text-muted-foreground">Original: {formatSize(file.size)}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                        <X className="h-4 w-4 mr-2" /> Change
                                    </Button>
                                </div>

                                <div className="bg-muted/30 p-6 rounded-xl border border-border">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Sliders className="h-5 w-5 text-primary" />
                                            <span className="font-semibold">Compression Level: {quality[0]}%</span>
                                        </div>
                                        {compressedFile && (
                                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                                                New Size: {formatSize(compressedFile.size)}
                                            </Badge>
                                        )}
                                    </div>

                                    <Slider
                                        defaultValue={[80]}
                                        max={100}
                                        min={10}
                                        step={5}
                                        value={quality}
                                        onValueChange={setQuality}
                                        className="py-4"
                                    />
                                    <p className="text-xs text-muted-foreground text-center mt-2">
                                        Lower quality = Smaller file size
                                    </p>
                                </div>

                                <Button
                                    onClick={handleDownload}
                                    disabled={!compressedFile || isCompressing}
                                    className="w-full mt-6 h-12 text-lg"
                                    size="lg"
                                >
                                    {isCompressing ? (
                                        <>
                                            <Loader className="h-5 w-5 mr-2 animate-spin" /> Compressing...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-5 w-5 mr-2" /> Download Compressed Image
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg, image/png, image/webp"
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

                </div>
            </main>
        </div>
    );
}
