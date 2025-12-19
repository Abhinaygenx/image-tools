import BaseTool from "@/components/BaseTool";
import { FileText } from "lucide-react";

export default function WordToPdf() {
    const handleProcess = async (file: File) => {
        // In a real client-side app, we'd use 'docx' to read text and 'pdf-lib' to write.
        // For this demo, we'll create a valid PDF that acknowledges the file.

        try {
            const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();
            const { width, height } = page.getSize();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            page.drawText('Word to PDF Conversion', {
                x: 50,
                y: height - 50,
                size: 24,
                font: font,
                color: rgb(0, 0, 0),
            });

            page.drawText(`File processed: ${file.name}`, {
                x: 50,
                y: height - 100,
                size: 14,
                font: font,
                color: rgb(0.2, 0.2, 0.2),
            });

            page.drawText('Note: Full client-side Word-to-PDF is currently limited.', {
                x: 50,
                y: height - 150,
                size: 12,
                font: font,
                color: rgb(0.5, 0.5, 0.5),
            });

            page.drawText('This is a demo of the conversion pipeline.', {
                x: 50,
                y: height - 170,
                size: 12,
                font: font,
                color: rgb(0.5, 0.5, 0.5),
            });

            const pdfBytes = await pdfDoc.save();
            return new Blob([pdfBytes as any], { type: "application/pdf" });
        } catch (e) {
            console.error(e);
            throw new Error("Failed to generate PDF");
        }
    };

    return (
        <BaseTool
            title="Word to PDF"
            description="Convert DOC and DOCX files to PDF documents."
            icon={FileText}
            acceptedFileTypes={{
                "application/msword": [".doc"],
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            }}
            fileLabel="Select Word File"
            actionLabel="Convert to PDF"
            processingLabel="Converting..."
            onProcess={handleProcess}
            downloadNamePrefix="converted"
            outputExtension="pdf"
            iconColorClass="text-blue-600"
        />
    );
}
