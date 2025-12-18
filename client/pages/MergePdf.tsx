import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  ArrowLeft,
  Upload,
  X,
  Download,
  Loader,
  GripVertical,
} from "lucide-react";

interface PdfFile {
  id: string;
  file: File;
}

export default function MergePdf() {
  const [pdfs, setPdfs] = useState<PdfFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newPdfs: PdfFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type !== "application/pdf") {
        setError(`${file.name} is not a valid PDF file`);
        continue;
      }

      if (file.size > 50 * 1024 * 1024) {
        setError(`${file.name} is larger than 50MB`);
        continue;
      }

      newPdfs.push({
        id: `${Date.now()}-${Math.random()}`,
        file,
      });
    }

    setPdfs([...pdfs, ...newPdfs]);
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

  const removePdf = (id: string) => {
    setPdfs(pdfs.filter((pdf) => pdf.id !== id));
  };

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragEnter = (id: string) => {
    if (!draggedItem || draggedItem === id) return;

    const draggedIndex = pdfs.findIndex((p) => p.id === draggedItem);
    const targetIndex = pdfs.findIndex((p) => p.id === id);

    const newPdfs = [...pdfs];
    const [draggedPdf] = newPdfs.splice(draggedIndex, 1);
    newPdfs.splice(targetIndex, 0, draggedPdf);

    setPdfs(newPdfs);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleConvert = async () => {
    if (pdfs.length < 2) {
      setError("Please select at least 2 PDF files to merge");
      return;
    }

    setIsConverting(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      pdfs.forEach((pdf) => {
        formData.append("pdfs", pdf.file);
      });

      const response = await fetch("/api/convert/merge-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Merge failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = "Failed to merge PDF files";
        }
        throw new Error(errorMessage);
      }

      // Download the merged PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `merged-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);
      setTimeout(() => {
        setPdfs([]);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Merge failed");
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
            <h1 className="text-4xl font-bold sm:text-5xl">Merge PDF Files</h1>
            <p className="mt-2 text-lg text-foreground/70">
              Combine multiple PDF documents into a single file
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
                Upload your PDFs
              </h3>
              <p className="mt-2 text-foreground/70">
                Drag and drop or click to select PDF files
              </p>
              <p className="mt-2 text-sm text-foreground/50">
                Select at least 2 PDFs (Max 50MB each)
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary mt-6"
              >
                Select PDFs
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
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
                <p className="font-medium">✓ PDFs merged successfully!</p>
              </div>
            </div>
          )}

          {/* PDF List */}
          {pdfs.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                {pdfs.length} PDF{pdfs.length !== 1 ? "s" : ""} selected (Drag
                to reorder)
              </h3>
              <div className="space-y-2">
                {pdfs.map((pdf, index) => (
                  <div
                    key={pdf.id}
                    draggable
                    onDragStart={() => handleDragStart(pdf.id)}
                    onDragEnter={() => handleDragEnter(pdf.id)}
                    onDragEnd={handleDragEnd}
                    className={`card-base flex items-center gap-3 cursor-move transition-all ${
                      draggedItem === pdf.id ? "opacity-50" : ""
                    }`}
                  >
                    <GripVertical className="h-5 w-5 text-foreground/50 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {pdf.file.name}
                      </p>
                      <p className="text-sm text-foreground/70">
                        {(pdf.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-primary flex-shrink-0">
                      Page {index + 1}
                    </span>
                    <button
                      onClick={() => removePdf(pdf.id)}
                      className="text-foreground/70 hover:text-destructive transition-colors flex-shrink-0"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {pdfs.length > 0 && (
              <button onClick={() => setPdfs([])} className="btn-ghost flex-1">
                Clear All
              </button>
            )}
            <button
              onClick={handleConvert}
              disabled={pdfs.length < 2 || isConverting}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isConverting ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Merging...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Merge PDFs
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
                  Upload multiple PDF files using the drag-and-drop area or file
                  selector
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">2.</span>
                <span>
                  Reorder the PDFs by dragging them to your desired sequence
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">3.</span>
                <span>
                  Click "Merge PDFs" to combine all files into a single document
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">4.</span>
                <span>Download your merged PDF file</span>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-foreground/70">
                <strong>Note:</strong> PDFs are merged in the order they appear
                in your list. You can drag and drop to reorder before merging.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
