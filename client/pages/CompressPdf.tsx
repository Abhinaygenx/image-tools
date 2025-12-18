import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowLeft, Upload, X, Download, Loader } from "lucide-react";

export default function CompressPdf() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const file = files[0];

    if (file.type !== "application/pdf") {
      setError("Please select a valid PDF file");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("File is larger than 50MB");
      return;
    }

    setPdfFile(file);
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

  const handleCompress = async () => {
    if (!pdfFile) {
      setError("Please select a PDF file");
      return;
    }

    setIsConverting(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);

      const response = await fetch("/api/convert/compress-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Compression failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = "Failed to compress PDF";
        }
        throw new Error(errorMessage);
      }

      // Download the compressed PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compressed-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);
      setTimeout(() => {
        setPdfFile(null);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compression failed");
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
            <h1 className="text-4xl font-bold sm:text-5xl">Compress PDF</h1>
            <p className="mt-2 text-lg text-foreground/70">
              Reduce your PDF file size while maintaining quality
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
                Upload your PDF
              </h3>
              <p className="mt-2 text-foreground/70">
                Drag and drop or click to select a PDF file
              </p>
              <p className="mt-2 text-sm text-foreground/50">
                Supported: PDF files (Max 50MB)
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary mt-6"
              >
                Select PDF
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
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
                <p className="font-medium">✓ PDF compressed successfully!</p>
              </div>
            </div>
          )}

          {/* File Info */}
          {pdfFile && (
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Selected File
              </h3>
              <div className="card-base flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{pdfFile.name}</p>
                  <p className="mt-1 text-sm text-foreground/70">
                    {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setPdfFile(null)}
                  className="text-foreground/70 hover:text-destructive transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {pdfFile && (
              <button
                onClick={() => setPdfFile(null)}
                className="btn-ghost flex-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={handleCompress}
              disabled={!pdfFile || isConverting}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isConverting ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Compressing...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Compress PDF
                </>
              )}
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-12 rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              How it works
            </h3>
            <ul className="space-y-3 text-foreground/70">
              <li className="flex gap-3">
                <span className="font-semibold text-primary">1.</span>
                <span>
                  Upload your PDF file using the drag-and-drop area or file
                  selector
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">2.</span>
                <span>Our compression algorithm optimizes the PDF file</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">3.</span>
                <span>
                  Click "Compress PDF" to start the compression process
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">4.</span>
                <span>Download your compressed PDF file with reduced size</span>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-foreground/70">
                <strong>Note:</strong> Compression removes unnecessary metadata
                and optimizes the PDF structure. Most PDFs can be compressed by
                20-40% without visible quality loss.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
