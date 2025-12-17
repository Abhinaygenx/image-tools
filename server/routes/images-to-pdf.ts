import { RequestHandler } from "express";
import PDFDocument from "pdfkit";
import sharp from "sharp";

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

    // Process images metadata first to determine page sizes
    const imageMetadata = [];
    for (const file of files) {
      try {
        const metadata = await sharp(file.buffer).metadata();
        if (metadata.width && metadata.height) {
          imageMetadata.push({
            file,
            width: metadata.width,
            height: metadata.height,
            aspectRatio: metadata.width / metadata.height,
          });
        }
      } catch (error) {
        console.error(`Error reading metadata for ${file.originalname}:`, error);
      }
    }

    if (imageMetadata.length === 0) {
      return res.status(400).json({
        error: "Could not process any images",
        success: false,
      });
    }

    // Create PDF with first page dimensions based on first image
    const firstImage = imageMetadata[0];
    const pageWidth = Math.min(firstImage.width, 1000); // Cap width at 1000 points
    const pageHeight = pageWidth / firstImage.aspectRatio;

    const pdf = new PDFDocument({
      size: [pageWidth, pageHeight],
      margin: 0,
    });

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=\"converted.pdf\"");

    // Pipe PDF to response
    pdf.pipe(res);

    // Process and add each image
    for (let i = 0; i < imageMetadata.length; i++) {
      try {
        const imgData = imageMetadata[i];

        // Normalize image to fit page while maintaining aspect ratio
        // Max width/height in points (slightly smaller to account for any rendering)
        const MAX_WIDTH = imgData.width > 1000 ? 1000 : imgData.width;
        const MAX_HEIGHT = MAX_WIDTH / imgData.aspectRatio;

        // Convert image to PNG and scale down if necessary
        const imageBuffer = await sharp(imgData.file.buffer)
          .resize(Math.round(MAX_WIDTH), Math.round(MAX_HEIGHT), {
            fit: "contain",
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          })
          .png()
          .toBuffer();

        // Add new page if not first image - size it to match this image's aspect ratio
        if (i > 0) {
          pdf.addPage({
            size: [MAX_WIDTH, MAX_HEIGHT],
            margin: 0,
          });
        }

        // Add image at 0,0 to fill the entire page
        pdf.image(imageBuffer, 0, 0, {
          width: MAX_WIDTH,
          height: MAX_HEIGHT,
        });
      } catch (error) {
        console.error(`Error processing file ${imageMetadata[i].file.originalname}:`, error);
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
