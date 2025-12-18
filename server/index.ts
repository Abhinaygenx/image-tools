import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { handleDemo } from "./routes/demo";
import { handleImagesToPdf } from "./routes/images-to-pdf";
import { handlePdfToWord } from "./routes/pdf-to-word";
import { handleImageToWord } from "./routes/image-to-word";
import { handleMergePdf } from "./routes/merge-pdf";
import { handleCompressPdf } from "./routes/compress-pdf";
import { handleProtectPdf } from "./routes/protect-pdf";

// Configure multer for file uploads
const uploadMultiple = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per file
  },
});

const uploadSingle = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per file
  },
});

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Document conversion endpoints
  app.post("/api/convert/images-to-pdf", uploadMultiple.array("images", 50), handleImagesToPdf);
  app.post("/api/convert/pdf-to-word", uploadSingle.single("pdf"), handlePdfToWord);
  app.post("/api/convert/image-to-word", uploadMultiple.array("images", 50), handleImageToWord);
  app.post("/api/convert/merge-pdf", uploadMultiple.array("pdfs", 50), handleMergePdf);
  app.post("/api/convert/compress-pdf", uploadSingle.single("pdf"), handleCompressPdf);
  app.post("/api/convert/protect-pdf", uploadSingle.single("pdf"), handleProtectPdf);

  return app;
}
