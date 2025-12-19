import BaseTool from "@/components/BaseTool";
import { Presentation } from "lucide-react";

export default function PptToPdf() {
    const handleProcess = async (file: File) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const dummyContent = "%PDF-1.7\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF";
        const blob = new Blob([dummyContent], { type: "application/pdf" });
        return blob;
    };

    return (
        <BaseTool
            title="PPT to PDF"
            description="Convert PowerPoint presentations to PDF."
            icon={Presentation}
            acceptedFileTypes={{
                "application/vnd.ms-powerpoint": [".ppt"],
                "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
            }}
            fileLabel="Select Presentation"
            actionLabel="Convert to PDF"
            processingLabel="Converting..."
            onProcess={handleProcess}
            downloadNamePrefix="converted"
            outputExtension="pdf"
            iconColorClass="text-orange-600"
        />
    );
}
