import { RequestHandler } from "express";
import pdfParse from "pdf-parse";
import { Document, Packer, Paragraph, TextRun } from "docx";

// Set up pdf-parse with the default worker
let pdfParseSetup = false;

const initPdfParse = async () => {
  if (!pdfParseSetup) {
    try {
      // pdf-parse requires pdfjs-dist for PDF.js worker
      const pdfjs = await import("pdfjs-dist");
      pdfParse.default = pdfParse;
      pdfParseSetup = true;
    } catch {
      // If pdfjs-dist is not available, continue with standard pdfParse
      pdfParseSetup = true;
    }
  }
};

export const handlePdfToWord: RequestHandler = async (req, res) => {
  try {
    await initPdfParse();

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

    // Parse PDF and extract text
    let pdfData;
    try {
      // Use pdf-parse to extract text from PDF
      pdfData = await pdfParse(file.buffer);
    } catch (error) {
      console.error("Error parsing PDF:", error);
      return res.status(400).json({
        error: "Could not parse PDF file. Please ensure it's a valid PDF document.",
        success: false,
      });
    }

    // Extract text from PDF
    const text = pdfData.text || "";

    if (!text.trim()) {
      return res.status(400).json({
        error: "No text content found in PDF. The PDF might be image-based or encrypted.",
        success: false,
      });
    }

    // Split text into paragraphs (by double newlines or single newlines)
    const paragraphs = text
      .split(/\n\n+|\n/)
      .map(para => para.trim())
      .filter(para => para.length > 0)
      .map(para => new Paragraph({
        text: para,
        spacing: {
          line: 240, // 1.0 line spacing
          after: 200, // Space after paragraph
        },
      }));

    // Create Word document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: `Converted from: ${file.originalname}`,
            spacing: {
              after: 400,
            },
            bold: true,
          }),
          new Paragraph({
            text: "",
            spacing: {
              after: 200,
            },
          }),
          ...paragraphs,
        ],
      }],
    });

    // Generate Word document buffer
    const buffer = await Packer.toBuffer(doc);

    // Set response headers for Word document download
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename="converted-${Date.now()}.docx"`);
    res.setHeader("Content-Length", buffer.length);

    // Send the document
    res.send(buffer);
  } catch (error) {
    console.error("Error converting PDF to Word:", error);
    res.status(500).json({
      error: "Failed to convert PDF to Word",
      success: false,
    });
  }
};
