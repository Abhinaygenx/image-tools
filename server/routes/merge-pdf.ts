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
          // Load the PDF with error handling
          let pdf;
          try {
            pdf = await PDFDocument.load(file.buffer);
          } catch (loadError) {
            console.error(`Error loading PDF ${file.originalname}:`, loadError);
            return res.status(400).json({
              error: `Could not read PDF file: ${file.originalname}. It may be corrupted, encrypted, or in an unsupported format.`,
              success: false,
            });
          }

          // Get all pages from this PDF
          const pages = pdf.getPages();

          if (pages.length === 0) {
            console.warn(`PDF ${file.originalname} has no pages, skipping`);
            continue;
          }

          // Copy each page to the merged document
          for (const page of pages) {
            try {
              const copiedPage = await mergedPdf.embedPage(page);
              mergedPdf.addPage(copiedPage);
            } catch (pageError) {
              console.error(`Error processing page in ${file.originalname}:`, pageError);
              // Skip problematic pages but continue with others
            }
          }
        } catch (error) {
          console.error(`Error processing PDF ${file.originalname}:`, error);
          return res.status(400).json({
            error: `Could not process PDF: ${file.originalname}. Ensure it's a valid PDF file.`,
            success: false,
          });
        }
      }

      // Check if we have any pages in the merged PDF
      if (mergedPdf.getPageCount() === 0) {
        return res.status(400).json({
          error: "No pages could be extracted from the provided PDFs. Please check your files.",
          success: false,
        });
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
