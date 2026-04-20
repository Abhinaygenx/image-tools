import BaseTool from "@/components/BaseTool";
import { FileText } from "lucide-react";

export default function PdfToTxt() {
    const handleProcess = async (file: File) => {
        // Since extracting text from PDF entirely client-side requires a large library like pdfjs-dist
        // We will mock the extraction for this template or use a placeholder text.
        // In a real application, you would send this to a backend or use pdfjs-dist.
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const content = `PDF to Text Extraction Demo\n\nFile Name: ${file.name}\nSize: ${file.size} bytes\n\nNote: This is a placeholder extraction. Full text extraction requires a backend service or large client-side parsing libraries.`;
        
        return new Blob([content], { type: "text/plain" });
    };

    return (
        <BaseTool
            title="PDF to Text"
            description="Extract text content from PDF documents."
            icon={FileText}
            acceptedFileTypes={{
                "application/pdf": [".pdf"],
            }}
            fileLabel="Select PDF"
            actionLabel="Extract Text"
            processingLabel="Extracting..."
            onProcess={handleProcess}
            downloadNamePrefix="extracted"
            outputExtension="txt"
            iconColorClass="text-purple-600"
        />
    );
}
