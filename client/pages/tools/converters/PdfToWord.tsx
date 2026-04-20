import BaseTool from "@/components/BaseTool";
import { FileText } from "lucide-react";

export default function PdfToWord() {
    const handleProcess = async (file: File) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Mock result: simple text file renamed to .docx for demonstration
        // In a real app we would use server-side conversion or specialized complex browser libs like docx
        const blob = new Blob(["This is a demonstration of the converted DOCX content."], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        return blob;
    };

    return (
        <BaseTool
            title="PDF to Word (DOCX)"
            description="Convert PDF documents to editable Microsoft Word (DOCX) files."
            icon={FileText}
            acceptedFileTypes={{
                "application/pdf": [".pdf"],
            }}
            fileLabel="Select PDF"
            actionLabel="Convert to DOCX"
            processingLabel="Converting..."
            onProcess={handleProcess}
            downloadNamePrefix="converted"
            outputExtension="docx"
            iconColorClass="text-blue-600"
        />
    );
}
