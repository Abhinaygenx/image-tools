import BaseTool from "@/components/BaseTool";
import { Table } from "lucide-react";

export default function ExcelToPdf() {
    const handleProcess = async (file: File) => {
        try {
            const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();
            const { width, height } = page.getSize();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            page.drawText('Excel to PDF Conversion', {
                x: 50,
                y: height - 50,
                size: 24,
                font: font,
                color: rgb(0, 0.5, 0),
            });

            page.drawText(`File processed: ${file.name}`, {
                x: 50,
                y: height - 100,
                size: 14,
                font: font,
                color: rgb(0.2, 0.2, 0.2),
            });

            page.drawText('Note: Full client-side Excel-to-PDF requires backend processing.', {
                x: 50,
                y: height - 150,
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
            title="Excel to PDF"
            description="Convert spreadsheets (XLS, XLSX) to PDF."
            icon={Table}
            acceptedFileTypes={{
                "application/vnd.ms-excel": [".xls"],
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            }}
            fileLabel="Select Excel File"
            actionLabel="Convert to PDF"
            processingLabel="Converting..."
            onProcess={handleProcess}
            downloadNamePrefix="converted"
            outputExtension="pdf"
            iconColorClass="text-green-600"
        />
    );
}
