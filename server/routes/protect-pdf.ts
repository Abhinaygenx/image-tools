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
      // Load the PDF
      const pdf = await PDFDocument.load(file.buffer);

      // Encrypt the PDF with the provided password
      // This will require the password to open the document
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
