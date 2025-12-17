import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { handleDemo } from "./routes/demo";
import { handleImagesToPdf } from "./routes/images-to-pdf";
import { handlePdfToWord } from "./routes/pdf-to-word";

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

  return app;
}
