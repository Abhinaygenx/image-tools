import BaseTool from "@/components/BaseTool";
import { Presentation } from "lucide-react";

export default function PdfToPpt() {
    const handleProcess = async (file: File) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const blob = new Blob(["Simulated PPTX content"], { type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" });
        return blob;
    };

    return (
        <BaseTool
            title="PDF to PPT"
            description="Convert PDF slides to PowerPoint."
            icon={Presentation}
            acceptedFileTypes={{
                "application/pdf": [".pdf"],
            }}
            fileLabel="Select PDF"
            actionLabel="Convert to PPT"
            processingLabel="Converting..."
            onProcess={handleProcess}
            downloadNamePrefix="converted"
            outputExtension="pptx"
            iconColorClass="text-orange-600"
        />
    );
}
