import { Link } from "react-router-dom";
import {
  FileText,
  Image,
  Download,
  Lock,
  ArrowLeft,
  UploadCloud,
} from "lucide-react";

export default function Tools() {
  const tools = [
    {
      id: 1,
      icon: Image,
      title: "Multiple Images to PDF",
      description: "Combine multiple images into one PDF file",
      color: "from-blue-500 to-blue-600",
      lightColor: "from-blue-50 to-blue-100",
      route: "/tools/images-to-pdf",
      available: true,
    },
    {
      id: 2,
      icon: FileText,
      title: "PDF to Word",
      description: "Convert PDF documents to editable Word format",
      color: "from-purple-500 to-purple-600",
      lightColor: "from-purple-50 to-purple-100",
      route: "/tools/pdf-to-word",
      available: false,
    },
    {
      id: 3,
      icon: Image,
      title: "Image to Word",
      description: "Convert image files to editable Word documents",
      color: "from-pink-500 to-pink-600",
      lightColor: "from-pink-50 to-pink-100",
      route: "/tools/image-to-word",
      available: false,
    },
    {
      id: 4,
      icon: FileText,
      title: "PDF Merger",
      description: "Merge multiple PDF files into a single document",
      color: "from-green-500 to-green-600",
      lightColor: "from-green-50 to-green-100",
      route: "/tools/merge-pdf",
      available: false,
    },
    {
      id: 5,
      icon: Download,
      title: "PDF Compressor",
      description: "Reduce your PDF file size while keeping quality",
      color: "from-orange-500 to-orange-600",
      lightColor: "from-orange-50 to-orange-100",
      route: "/tools/compress-pdf",
      available: false,
    },
    {
      id: 6,
      icon: Lock,
      title: "PDF Protector",
      description: "Protect your PDF with a password",
      color: "from-red-500 to-red-600",
      lightColor: "from-red-50 to-red-100",
      route: "/tools/protect-pdf",
      available: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="container-custom flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="hidden text-xl font-bold text-foreground sm:inline">
              PDF Pro
            </span>
          </Link>
          <Link to="/" className="btn-ghost flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-16 sm:py-24">
        <div className="mx-auto mb-16 max-w-2xl">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Choose Your Conversion
          </h1>
          <p className="mt-4 text-lg text-foreground/70">
            Select a tool below to get started with your document conversion
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="group card-base overflow-hidden transition-all duration-300 hover:-translate-y-1 relative"
              >
                {!tool.available && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
                    <div className="text-center">
                      <p className="text-white font-semibold">Coming Soon</p>
                      <p className="text-white/80 text-sm mt-1">
                        This tool is being developed
                      </p>
                    </div>
                  </div>
                )}
                <div
                  className={`mb-6 inline-flex rounded-lg bg-gradient-to-br ${tool.lightColor} p-4 transition-all duration-200 group-hover:scale-110`}
                >
                  <Icon className="h-8 w-8 text-primary" />
                </div>

                <h3 className="text-xl font-semibold text-foreground">
                  {tool.title}
                </h3>
                <p className="mt-2 text-foreground/70">{tool.description}</p>

                <div className="mt-8 flex flex-col gap-3">
                  {tool.available ? (
                    <Link
                      to={tool.route}
                      className={`flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${tool.color} px-4 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg active:scale-95`}
                    >
                      <UploadCloud className="h-5 w-5" />
                      Upload Files
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 rounded-lg bg-muted px-4 py-3 font-semibold text-muted-foreground cursor-not-allowed opacity-50"
                    >
                      <UploadCloud className="h-5 w-5" />
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-20 rounded-2xl border border-border bg-gradient-to-br from-primary-50 to-background p-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            How It Works
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                1
              </div>
              <h3 className="font-semibold text-foreground">Upload</h3>
              <p className="mt-2 text-sm text-foreground/70">
                Select the tool and upload your file securely
              </p>
            </div>
            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                2
              </div>
              <h3 className="font-semibold text-foreground">Convert</h3>
              <p className="mt-2 text-sm text-foreground/70">
                We process your file with high-quality conversion
              </p>
            </div>
            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                3
              </div>
              <h3 className="font-semibold text-foreground">Download</h3>
              <p className="mt-2 text-sm text-foreground/70">
                Download your converted file instantly
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
