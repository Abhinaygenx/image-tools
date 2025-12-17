import { RequestHandler } from "express";
import PDFDocument from "pdfkit";
import sharp from "sharp";
import { Readable } from "stream";

interface ConversionRequest {
  images: Array<{
    data: Buffer;
    name: string;
  }>;
}

export const handleImagesToPdf: RequestHandler = async (req, res) => {
  try {
    // Get image files from the request
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

    // Process images and create PDF
    const pdf = new PDFDocument({
      size: "A4",
      margin: 0,
    });

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=\"converted.pdf\"");

    // Pipe PDF to response
    pdf.pipe(res);

    // Process each image
    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i];

        // Resize image to fit A4 page (595x842 points, with margins)
        const metadata = await sharp(file.buffer).metadata();
        
        if (!metadata.width || !metadata.height) {
          console.error(`Skipping file ${file.originalname}: unable to read dimensions`);
          continue;
        }

        // Resize to fit A4 page
        const MAX_WIDTH = 595 - 40; // A4 width minus margins
        const MAX_HEIGHT = 842 - 40; // A4 height minus margins

        const scale = Math.min(MAX_WIDTH / metadata.width, MAX_HEIGHT / metadata.height, 1);
        const newWidth = Math.round(metadata.width * scale);
        const newHeight = Math.round(metadata.height * scale);

        // Convert image to PNG buffer for PDF compatibility
        const imageBuffer = await sharp(file.buffer)
          .resize(newWidth, newHeight, {
            fit: "contain",
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          })
          .png()
          .toBuffer();

        // Add new page if not the first image
        if (i > 0) {
          pdf.addPage();
        }

        // Center image on page
        const x = (595 - newWidth) / 2;
        const y = (842 - newHeight) / 2;

        pdf.image(imageBuffer, x, y, {
          width: newWidth,
          height: newHeight,
        });
      } catch (error) {
        console.error(`Error processing file ${files[i].originalname}:`, error);
        // Continue with next file instead of failing completely
        continue;
      }
    }

    // Finalize PDF
    pdf.end();
  } catch (error) {
    console.error("Error converting images to PDF:", error);
    res.status(500).json({
      error: "Failed to convert images to PDF",
      success: false,
    });
  }
};
