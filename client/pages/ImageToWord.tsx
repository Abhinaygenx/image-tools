import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowLeft, Upload, X, Download, Loader } from "lucide-react";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

export default function ImageToWord() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages: ImageFile[] = [];
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/tiff"];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!validTypes.includes(file.type)) {
        setError(`${file.name} is not a supported image format`);
        continue;
      }

      if (file.size > 50 * 1024 * 1024) {
        setError(`${file.name} is larger than 50MB`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: e.target?.result as string,
        });

        if (newImages.length === Array.from(files).filter(f => validTypes.includes(f.type)).length) {
          setImages([...images, ...newImages]);
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
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

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      setError("Please select at least one image");
      return;
    }

    setIsConverting(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      images.forEach(img => {
        formData.append("images", img.file);
      });

      const response = await fetch("/api/convert/image-to-word", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Conversion failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = "Failed to convert images to Word";
        }
        throw new Error(errorMessage);
      }

      // Download the Word document
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted-${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);
      setTimeout(() => {
        setImages([]);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="container-custom flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="hidden text-xl font-bold text-foreground sm:inline">
              PDF Pro
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold sm:text-5xl">Image to Word</h1>
            <p className="mt-2 text-lg text-foreground/70">
              Convert images to editable Word documents with OCR text extraction
            </p>
          </div>

          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="card-base mb-8 border-2 border-dashed border-border transition-all duration-200 hover:border-primary/50"
          >
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 inline-flex rounded-full bg-gradient-to-br from-primary/10 to-accent/10 p-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Upload your images
              </h3>
              <p className="mt-2 text-foreground/70">
                Drag and drop or click to select image files
              </p>
              <p className="mt-2 text-sm text-foreground/50">
                Supported: JPEG, PNG, WebP, TIFF (Max 50MB each)
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary mt-6"
              >
                Select Images
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/tiff"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
              <div className="flex-1">
                <p className="font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-destructive/70 hover:text-destructive"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-700">
              <div className="flex-1">
                <p className="font-medium">✓ Word document created successfully!</p>
              </div>
            </div>
          )}

          {/* Image List */}
          {images.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                {images.length} image{images.length !== 1 ? "s" : ""} selected
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="group relative overflow-hidden rounded-lg border border-border bg-muted"
                  >
                    <img
                      src={image.preview}
                      alt={image.file.name}
                      className="h-24 w-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <p className="text-center text-xs font-medium text-white px-2">
                        {image.file.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {images.length > 0 && (
              <button
                onClick={() => setImages([])}
                className="btn-ghost flex-1"
              >
                Clear All
              </button>
            )}
            <button
              onClick={handleConvert}
              disabled={images.length === 0 || isConverting}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isConverting ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Convert to Word
                </>
              )}
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-12 rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">How it works</h3>
            <ul className="space-y-3 text-foreground/70">
              <li className="flex gap-3">
                <span className="font-semibold text-primary">1.</span>
                <span>Upload multiple image files using the drag-and-drop area or file selector</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">2.</span>
                <span>Our OCR technology extracts text from each image</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">3.</span>
                <span>Click "Convert to Word" to create an editable document</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">4.</span>
                <span>Download your Word file with all extracted text</span>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-foreground/70">
                <strong>Note:</strong> This tool uses OCR (Optical Character Recognition) to extract text from images. The accuracy depends on image quality and text clarity. Best results with clear, well-lit images.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
