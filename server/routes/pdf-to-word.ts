import { RequestHandler } from "express";
import pdfParse from "pdf-parse";
import { Document, Packer, Paragraph, TextRun } from "docx";

export const handlePdfToWord: RequestHandler = async (req, res) => {
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

    // Parse PDF and extract text
    let pdfData;
    try {
      pdfData = await pdfParse(file.buffer);
    } catch (error) {
      console.error("Error parsing PDF:", error);
      // Try with a different approach if the first one fails
      try {
        // Sometimes PDFs need special handling
        const pdf = await pdfParse(file.buffer, {
          password: "",
          max: 0, // No max pages
        });
        pdfData = pdf;
      } catch (retryError) {
        console.error("Error parsing PDF (retry):", retryError);
        return res.status(400).json({
          error:
            "Could not parse PDF file. It may be corrupted, encrypted, or in an unsupported format.",
          success: false,
        });
      }
    }

    // Extract text from PDF
    const text = pdfData.text || "";

    if (!text.trim()) {
      return res.status(400).json({
        error:
          "No text content found in PDF. The PDF might be image-based, scanned, or have protection that prevents text extraction.",
        success: false,
      });
    }

    // Split text by single newlines to preserve formatting and spacing
    const lines = text.split("\n");

    // Create paragraphs, preserving the original spacing and structure
    const documentParagraphs = [
      new Paragraph({
        children: [
          new TextRun({
            text: `Converted from: ${file.originalname}`,
            bold: true,
          }),
        ],
        spacing: {
          after: 400,
        },
      }),
      new Paragraph({
        children: [new TextRun({ text: "" })],
        spacing: {
          after: 200,
        },
      }),
      ...lines.map(
        (line) =>
          new Paragraph({
            children: [new TextRun({ text: line || "" })],
            spacing: {
              line: 240,
              after: 0,
            },
          }),
      ),
    ];

    // Create Word document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: documentParagraphs,
        },
      ],
    });

    // Generate Word document buffer
    const buffer = await Packer.toBuffer(doc);

    // Set response headers for Word document download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="converted-${Date.now()}.docx"`,
    );
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
