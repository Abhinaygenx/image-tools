import { RequestHandler } from "express";
import { PDFDocument } from "pdf-lib";

export const handleProtectPdf: RequestHandler = async (req, res) => {
  try {
    // Get PDF file and password from request
    const file = req.file as Express.Multer.File | undefined;
    const { password } = req.body;

    if (!file) {
      return res.status(400).json({
        error: "No file provided",
        success: false,
      });
    }

    if (!password || typeof password !== "string" || password.trim().length === 0) {
      return res.status(400).json({
        error: "Password is required",
        success: false,
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        error: "Password must be at least 4 characters long",
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

      // Check if PDF has pages
      const pages = pdf.getPages();
      if (pages.length === 0) {
        return res.status(400).json({
          error: "The PDF file appears to be empty.",
          success: false,
        });
      }

      // Encrypt the PDF with the provided password
      // This will require the password to open the document
      try {
        // First, try to encrypt the existing PDF
        await pdf.encrypt({
          userPassword: password,
          ownerPassword: password,
          permissions: {
            printing: "fullQuality",
            modifyContents: false,
            copying: false,
            modifyAnnotations: false,
            fillingForms: false,
            contentAccessibility: true,
            documentAssembly: false,
          },
        });
      } catch (encryptError) {
        console.error("Error encrypting PDF directly:", encryptError);

        // If direct encryption fails, try to rebuild the PDF by copying pages
        try {
          console.log("Attempting to rebuild PDF for encryption...");
          const newPdf = await PDFDocument.create();
          const pages = pdf.getPages();

          for (const page of pages) {
            const copiedPage = await newPdf.embedPage(page);
            newPdf.addPage(copiedPage);
          }

          // Now try to encrypt the rebuilt PDF
          await newPdf.encrypt({
            userPassword: password,
            ownerPassword: password,
            permissions: {
              printing: "fullQuality",
              modifyContents: false,
              copying: false,
              modifyAnnotations: false,
              fillingForms: false,
              contentAccessibility: true,
              documentAssembly: false,
            },
          });

          pdf = newPdf;
        } catch (rebuildError) {
          console.error("Error rebuilding PDF for encryption:", rebuildError);
          return res.status(400).json({
            error: "This PDF file has special formatting that prevents password protection. Try opening it in Adobe Reader and re-saving it, then try again.",
            success: false,
          });
        }
      }

      // Save the protected PDF
      const protectedBytes = await pdf.save();

      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="protected-${Date.now()}.pdf"`
      );
      res.setHeader("Content-Length", protectedBytes.length);

      // Send the protected PDF
      res.send(Buffer.from(protectedBytes));
    } catch (error) {
      console.error("Error protecting PDF:", error);
      return res.status(400).json({
        error: "Failed to protect PDF. Please ensure it's a valid PDF file.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error processing protection request:", error);
    res.status(500).json({
      error: "Failed to protect PDF",
      success: false,
    });
  }
};
