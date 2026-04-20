import BaseTool from "@/components/BaseTool";
import { FileText } from "lucide-react";

export default function PdfToWord() {
    const handleProcess = async (file: File) => {
        const formData = new FormData();
        formData.append("pdf", file);

        const response = await fetch("/api/convert/pdf-to-word", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || "Failed to convert PDF to Word");
        }

        return await response.blob();
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
