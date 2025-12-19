import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import ToolsMarketplace from "./pages/ToolsMarketplace";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Pricing from "./pages/Pricing";

// Tools
import MergePdf from "./pages/tools/pdf/MergePdf";
import CompressPdf from "./pages/tools/pdf/CompressPdf";
import ProtectPdf from "./pages/tools/pdf/ProtectPdf";
import GPACalculator from "./pages/tools/academic/GPACalculator";
import ResumeBuilder from "./pages/tools/academic/ResumeBuilder";
import TextSummarizer from "./pages/tools/ai/TextSummarizer";
import JpgToPng from "./pages/tools/image/JpgToPng";
import PngToJpg from "./pages/tools/image/PngToJpg";
import CompressImage from "./pages/tools/image/CompressImage";
import Mp4ToMp3 from "./pages/tools/video/Mp4ToMp3";
import PdfToImage from "./pages/tools/pdf/PdfToImage";
import SplitPdf from "./pages/tools/pdf/SplitPdf";
import RotatePdf from "./pages/tools/pdf/RotatePdf";
import UnlockPdf from "./pages/tools/pdf/UnlockPdf";
import WatermarkPdf from "./pages/tools/pdf/WatermarkPdf";
import RemovePages from "./pages/tools/pdf/RemovePages";
import WordToPdf from "./pages/tools/converters/WordToPdf";
import PdfToWord from "./pages/tools/converters/PdfToWord";
import ExcelToPdf from "./pages/tools/converters/ExcelToPdf";
import PdfToExcel from "./pages/tools/converters/PdfToExcel";
import PptToPdf from "./pages/tools/converters/PptToPdf";
import PdfToPpt from "./pages/tools/converters/PdfToPpt";
import PomodoroTimer from "./pages/tools/academic/PomodoroTimer";
import ImagesToPdf from "./pages/tools/pdf/ImagesToPdf";
import NotFound from "./pages/NotFound";

import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import PricingManager from "./pages/admin/PricingManager";

const queryClient = new QueryClient();

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pricing" element={<Pricing />} />

      {/* Main Marketplace */}
      <Route path="/tools" element={<ToolsMarketplace />} />
      <Route path="/tools/pdf" element={<ToolsMarketplace />} />
      <Route path="/tools/academic" element={<ToolsMarketplace />} />
      <Route path="/tools/media" element={<ToolsMarketplace />} />
      <Route path="/tools/ai" element={<ToolsMarketplace />} />

      {/* --- Individual Tools --- */}

      {/* PDF Tools (Free for now, maybe protect Compress later) */}
      <Route path="/tools/pdf/merge-pdf" element={<MergePdf />} />
      <Route path="/tools/pdf/compress-pdf" element={<CompressPdf />} />
      <Route path="/tools/pdf/protect-pdf" element={<ProtectPdf />} />
      <Route path="/tools/pdf/images-to-pdf" element={<ImagesToPdf />} />
      <Route path="/tools/pdf/pdf-to-image" element={<PdfToImage />} />
      <Route path="/tools/pdf/split" element={<SplitPdf />} />
      <Route path="/tools/pdf/rotate" element={<RotatePdf />} />
      <Route path="/tools/pdf/unlock-pdf" element={<UnlockPdf />} />
      <Route path="/tools/pdf/watermark" element={<WatermarkPdf />} />
      <Route path="/tools/pdf/remove-pages" element={<RemovePages />} />

      {/* Converters */}
      <Route path="/tools/converters/word-to-pdf" element={<WordToPdf />} />
      <Route path="/tools/converters/pdf-to-word" element={<PdfToWord />} />
      <Route path="/tools/converters/excel-to-pdf" element={<ExcelToPdf />} />
      <Route path="/tools/converters/pdf-to-excel" element={<PdfToExcel />} />
      <Route path="/tools/converters/ppt-to-pdf" element={<PptToPdf />} />
      <Route path="/tools/converters/pdf-to-ppt" element={<PdfToPpt />} />


      {/* Academic (Free) */}
      <Route path="/tools/academic/gpa-calculator" element={<GPACalculator />} />
      <Route path="/tools/academic/resume-builder" element={<ResumeBuilder />} />
      <Route path="/tools/academic/pomodoro" element={<PomodoroTimer />} />

      {/* AI Tools (PROTECTED - PRO ONLY) */}
      <Route path="/tools/ai/summarizer" element={
        <ProtectedRoute requirePro>
          <TextSummarizer />
        </ProtectedRoute>
      } />

      {/* Media Tools (Mixed) */}
      <Route path="/tools/image/jpg-to-png" element={<JpgToPng />} />
      <Route path="/tools/image/png-to-jpg" element={<PngToJpg />} />

      {/* Protected Media Tool */}
      <Route path="/tools/image/compress" element={
        <ProtectedRoute requirePro>
          <CompressImage />
        </ProtectedRoute>
      } />

      <Route path="/tools/video/mp4-to-mp3" element={<Mp4ToMp3 />} />

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="pricing" element={<PricingManager />} />
          {/* Settings placeholder if needed */}
        </Route>
      </Route>

      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Router />
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
