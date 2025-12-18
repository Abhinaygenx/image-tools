import { RequestHandler } from "express";
import { PDFDocument } from "pdf-lib";

export const handleCompressPdf: RequestHandler = async (req, res) => {
  try {
    // Get PDF file from request
    const file = req.file as Express.Multer.File | undefined;

    if (!file) {
      return res.status(400).json({
        error: "No file provided",
        success: false,
      });
    }

    // Validate file type
    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({
        error: "Invalid file type. Only PDF files are supported.",
        success: false,
      });
    }

    try {
      // Load the PDF with error handling
      let pdf;
      try {
        pdf = await PDFDocument.load(file.buffer);
      } catch (parseError) {
        console.error("Error loading PDF:", parseError);
        return res.status(400).json({
          error: "The PDF file could not be read. It may be corrupted, encrypted, or in an unsupported format. Try re-saving the file in your PDF reader.",
          success: false,
        });
      }

      // Get the original file size
      const originalSize = file.size;

      // Compress by copying pages with proper dimensions
      const compressedPdf = await PDFDocument.create();

      // Copy pages with proper sizing
      const pages = pdf.getPages();

      if (pages.length === 0) {
        return res.status(400).json({
          error: "The PDF file appears to be empty.",
          success: false,
        });
      }

      for (const page of pages) {
        try {
          // Get the page dimensions
          const { width, height } = page.getSize();

          // Copy the page to the new document while preserving size
          const copiedPage = await compressedPdf.embedPage(page);
          compressedPdf.addPage([width, height], copiedPage);
        } catch (pageError) {
          console.error("Error processing page:", pageError);
          try {
            // Fallback: try basic embedding if the above fails
            const copiedPage = await compressedPdf.embedPage(page);
            compressedPdf.addPage(copiedPage);
          } catch (fallbackError) {
            console.error("Fallback page processing also failed:", fallbackError);
            // Continue with other pages even if one fails
          }
        }
      }

      // Save with compression
      const compressedBytes = await compressedPdf.save();
      const compressedSize = compressedBytes.length;

      // Calculate compression ratio
      const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="compressed-${Date.now()}.pdf"`
      );
      res.setHeader("Content-Length", compressedSize);
      res.setHeader("X-Original-Size", originalSize.toString());
      res.setHeader("X-Compressed-Size", compressedSize.toString());
      res.setHeader("X-Compression-Ratio", compressionRatio);

      // Send the compressed PDF
      res.send(Buffer.from(compressedBytes));
    } catch (error) {
      console.error("Error compressing PDF:", error);
      return res.status(400).json({
        error: "Failed to compress PDF. Please ensure it's a valid PDF file.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error processing compression request:", error);
    res.status(500).json({
      error: "Failed to compress PDF",
      success: false,
    });
  }
};
