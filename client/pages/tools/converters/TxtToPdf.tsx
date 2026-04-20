import BaseTool from "@/components/BaseTool";
import { FileText } from "lucide-react";

export default function TxtToPdf() {
    const handleProcess = async (file: File) => {
        try {
            const text = await file.text();
            const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
            const pdfDoc = await PDFDocument.create();
            let page = pdfDoc.addPage();
            const { width, height } = page.getSize();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            const fontSize = 12;
            const margin = 50;
            const textWidth = width - 2 * margin;
            
            // Basic text wrapping simulation
            const words = text.split(/\s+/);
            let y = height - margin;
            let currentLine = "";

            for (const word of words) {
                const testLine = currentLine + word + " ";
                const textLen = font.widthOfTextAtSize(testLine, fontSize);
                
                if (textLen > textWidth && currentLine !== "") {
                    page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0,0,0) });
                    currentLine = word + " ";
                    y -= fontSize + 4;
                    
                    if (y < margin) {
                        page = pdfDoc.addPage();
                        y = height - margin;
                    }
                } else {
                    currentLine = testLine;
                }
            }
            if (currentLine) {
                page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0,0,0) });
            }

            const pdfBytes = await pdfDoc.save();
            return new Blob([pdfBytes as any], { type: "application/pdf" });
        } catch (e) {
            console.error(e);
            throw new Error("Failed to generate PDF");
        }
    };

    return (
        <BaseTool
            title="Text to PDF"
            description="Convert plain text files (.txt) to PDF documents."
            icon={FileText}
            acceptedFileTypes={{
                "text/plain": [".txt"],
            }}
            fileLabel="Select Text File"
            actionLabel="Convert to PDF"
            processingLabel="Converting..."
            onProcess={handleProcess}
            downloadNamePrefix="converted"
            outputExtension="pdf"
            iconColorClass="text-blue-600"
        />
    );
}
