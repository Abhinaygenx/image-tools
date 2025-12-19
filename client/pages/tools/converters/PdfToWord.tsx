import BaseTool from "@/components/BaseTool";
import { FileText } from "lucide-react";

export default function PdfToWord() {
    const handleProcess = async (file: File) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Mock result: simple text file renamed to .doc for demonstration
        const blob = new Blob(["This is a demonstration of the converted content."], { type: "application/msword" });
        return blob;
    };

    return (
        <BaseTool
            title="PDF to Word"
            description="Convert PDF documents to editable Word files."
            icon={FileText}
            acceptedFileTypes={{
                "application/pdf": [".pdf"],
            }}
            fileLabel="Select PDF"
            actionLabel="Convert to Word"
            processingLabel="Converting..."
            onProcess={handleProcess}
            downloadNamePrefix="converted"
            outputExtension="doc"
            iconColorClass="text-blue-600"
        />
    );
}
