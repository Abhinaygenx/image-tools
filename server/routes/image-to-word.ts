import { RequestHandler } from "express";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, BorderStyle } from "docx";
import sharp from "sharp";
import Tesseract from "tesseract.js";

export const handleImageToWord: RequestHandler = async (req, res) => {
  try {
    // Get image files from request
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      return res.status(400).json({
        error: "No files provided",
        success: false,
      });
    }

    // Validate that all files are images
    const validImageTypes = ["image/jpeg", "image/png", "image/webp", "image/tiff"];
    const invalidFiles = files.filter(f => !validImageTypes.includes(f.mimetype));

    if (invalidFiles.length > 0) {
      return res.status(400).json({
        error: "Invalid file types. Only JPEG, PNG, WebP, and TIFF images are supported.",
        success: false,
      });
    }

    // Process images and extract text using OCR
    const documentParagraphs = [
      new Paragraph({
        text: `Document created from ${files.length} image(s)`,
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
    ];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // Add image header
        documentParagraphs.push(
          new Paragraph({
            text: `Image ${i + 1}: ${file.originalname}`,
            spacing: {
              after: 200,
            },
            bold: true,
          })
        );

        // Perform OCR using Tesseract
        console.log(`Processing OCR for image ${i + 1}/${files.length}...`);
        const result = await Tesseract.recognize(file.buffer, "eng", {
          logger: (m) => console.log(m),
        });

        const text = result.data.text || "";

        if (text.trim()) {
          // Add extracted text to document
          const textLines = text.split("\n").filter(line => line.trim());
          textLines.forEach(line => {
            documentParagraphs.push(
              new Paragraph({
                text: line,
                spacing: {
                  line: 240,
                  after: 0,
                },
              })
            );
          });
        } else {
          documentParagraphs.push(
            new Paragraph({
              text: "[No text detected in image]",
              spacing: {
                after: 200,
              },
              italics: true,
            })
          );
        }

        // Add separator
        documentParagraphs.push(
          new Paragraph({
            text: "",
            spacing: {
              after: 400,
            },
          })
        );
      } catch (error) {
        console.error(`Error processing image ${file.originalname}:`, error);
        documentParagraphs.push(
          new Paragraph({
            text: `[Error processing image: ${file.originalname}]`,
            spacing: {
              after: 200,
            },
            italics: true,
          })
        );
      }
    }

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
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="converted-${Date.now()}.docx"`
    );
    res.setHeader("Content-Length", buffer.length);

    // Send the document
    res.send(buffer);
  } catch (error) {
    console.error("Error converting images to Word:", error);
    res.status(500).json({
      error: "Failed to convert images to Word",
      success: false,
    });
  }
};
