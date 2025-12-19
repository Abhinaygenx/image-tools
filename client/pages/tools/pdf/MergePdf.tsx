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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      // Dynamic import to avoid SSR issues if any (though this is SPA)
      const { PDFDocument } = await import("pdf-lib");

      const mergedPdf = await PDFDocument.create();

      for (const pdfItem of pdfs) {
        const fileBuffer = await pdfItem.file.arrayBuffer();
        // Load the PDF document
        const pdf = await PDFDocument.load(fileBuffer);
        // Copy all pages
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        // Add pages to the merged PDF
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();

      // Download the merged PDF
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
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
      console.error(err);
      setError(err instanceof Error ? err.message : "Merge failed. Ensure files are valid and not password protected.");
    } finally {
      setIsConverting(false);
    }
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
              StudentHub PDF
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
            <h1 className="text-4xl font-bold sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent inline-block">Merge PDF Files</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Combine multiple PDF documents into a single, organized file.
            </p>
          </div>

          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-12 transition-all hover:border-primary/50 hover:bg-muted/50"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Upload your PDFs</h3>
            <p className="mt-2 text-center text-muted-foreground">
              Drag and drop your files here, or click to browse.
            </p>
            <p className="mt-1 text-sm text-muted-foreground/50">
              Max 50MB per file
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="mt-6"
              size="lg"
            >
              Select PDF Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="application/pdf"
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

          {/* PDF List */}
          {pdfs.length > 0 && (
            <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Selected Files <span className="text-muted-foreground text-base font-normal">({pdfs.length})</span>
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setPdfs([])} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <X className="h-4 w-4 mr-2" /> Clear All
                </Button>
              </div>

              <div className="space-y-2">
                {pdfs.map((pdf, index) => (
                  <div
                    key={pdf.id}
                    draggable
                    onDragStart={() => handleDragStart(pdf.id)}
                    onDragEnter={() => handleDragEnter(pdf.id)}
                    onDragEnd={handleDragEnd}
                    className={`group flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md ${draggedItem === pdf.id ? "opacity-50 ring-2 ring-primary ring-offset-2" : ""
                      }`}
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move opacity-50 group-hover:opacity-100" />
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{pdf.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(pdf.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePdf(pdf.id)}
                      className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleConvert}
                disabled={pdfs.length < 2 || isConverting}
                className="w-full mt-6 h-12 text-lg"
                size="lg"
              >
                {isConverting ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" /> Merging...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" /> Merge & Download
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-16 rounded-xl border border-border bg-muted/30 p-8">
            <h3 className="text-lg font-bold mb-4">How to merge PDFs</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">1</div>
                <span>Select or drag your PDF files into the upload area.</span>
              </li>
              <li className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">2</div>
                <span>Drag and drop the files to rearrange them in your desired order.</span>
              </li>
              <li className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">3</div>
                <span>Click "Merge & Download" to get your combined document instantly.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
