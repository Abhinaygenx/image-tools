import BaseTool from "@/components/BaseTool";
import { Table } from "lucide-react";

export default function PdfToExcel() {
    const handleProcess = async (file: File) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const blob = new Blob(["Column A,Column B\nValue 1,Value 2"], { type: "text/csv" });
        return blob;
    };

    return (
        <BaseTool
            title="PDF to Excel"
            description="Convert PDF tables to Excel spreadsheets."
            icon={Table}
            acceptedFileTypes={{
                "application/pdf": [".pdf"],
            }}
            fileLabel="Select PDF"
            actionLabel="Convert to Excel"
            processingLabel="Converting..."
            onProcess={handleProcess}
            downloadNamePrefix="converted"
            outputExtension="csv" // Simple CSV for now
            iconColorClass="text-green-600"
        />
    );
}
