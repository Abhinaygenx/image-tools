import { RequestHandler } from "express";
import { PDFDocument } from "pdf-lib";

export const handleMergePdf: RequestHandler = async (req, res) => {
  try {
    // Get PDF files from request
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      return res.status(400).json({
        error: "No files provided",
        success: false,
      });
    }

    if (files.length < 2) {
      return res.status(400).json({
        error: "Please select at least 2 PDF files to merge",
        success: false,
      });
    }

    // Validate that all files are PDFs
    const invalidFiles = files.filter(f => f.mimetype !== "application/pdf");

    if (invalidFiles.length > 0) {
      return res.status(400).json({
        error: "All files must be PDF documents",
        success: false,
      });
    }

    try {
      // Create a new PDF document to merge into
      const mergedPdf = await PDFDocument.create();

      // Process each PDF file
      for (const file of files) {
        try {
          // Load the PDF
          const pdf = await PDFDocument.load(file.buffer);

          // Get all pages from this PDF
          const pageCount = pdf.getPageCount();
          const pages = pdf.getPages();

          // Copy each page to the merged document
          for (const page of pages) {
            const copiedPage = await mergedPdf.embedPage(page);
            mergedPdf.addPage(copiedPage);
          }
        } catch (error) {
          console.error(`Error processing PDF ${file.originalname}:`, error);
          return res.status(400).json({
            error: `Could not process PDF: ${file.originalname}. Ensure it's a valid PDF file.`,
            success: false,
          });
        }
      }

      // Save the merged PDF
      const mergedPdfBytes = await mergedPdf.save();

      // Set response headers for PDF download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="merged-${Date.now()}.pdf"`
      );
      res.setHeader("Content-Length", mergedPdfBytes.length);

      // Send the PDF
      res.send(Buffer.from(mergedPdfBytes));
    } catch (error) {
      console.error("Error merging PDFs:", error);
      return res.status(400).json({
        error: "Failed to merge PDF files. Please ensure all files are valid PDFs.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error processing merge request:", error);
    res.status(500).json({
      error: "Failed to merge PDF files",
      success: false,
    });
  }
};
