import { Link } from "react-router-dom";
import {
  FileText,
  Image,
  Zap,
  Shield,
  ChevronRight,
  Download,
  Lock,
  Smartphone,
} from "lucide-react";

export default function Index() {
  const tools = [
    {
      icon: Image,
      title: "Multiple Images to PDF",
      description: "Convert multiple image files to a single PDF document",
      href: "/tools/images-to-pdf",
    },
    {
      icon: FileText,
      title: "PDF to Word",
      description: "Extract text from PDF and convert to editable Word format",
      href: "/tools/pdf-to-word",
    },
    {
      icon: Image,
      title: "Image to Word",
      description: "Convert image files directly to editable Word documents",
      href: "/tools/image-to-word",
    },
    {
      icon: FileText,
      title: "PDF Merger",
      description: "Merge multiple PDF files into a single document",
      href: "/tools/merge-pdf",
    },
    {
      icon: Download,
      title: "PDF Compressor",
      description: "Reduce PDF file size while maintaining quality",
      href: "/tools/compress-pdf",
    },
    {
      icon: Lock,
      title: "PDF Protector",
      description: "Add password protection to your PDF documents",
      href: "/tools/protect-pdf",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process your documents in seconds with our optimized engine",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your files are encrypted and automatically deleted after processing",
    },
    {
      icon: Smartphone,
      title: "All Devices",
      description: "Works seamlessly on desktop, tablet, and mobile devices",
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
          <nav className="flex items-center gap-8">
            <a
              href="#tools"
              className="hidden text-sm font-medium text-foreground/70 transition-colors hover:text-foreground md:inline"
            >
              Tools
            </a>
            <a
              href="#features"
              className="hidden text-sm font-medium text-foreground/70 transition-colors hover:text-foreground md:inline"
            >
              Features
            </a>
            <Link to="/tools" className="btn-primary">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-background to-background py-20 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl" />
          <div className="absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-gradient-to-tr from-accent/10 to-primary/10 blur-3xl" />
        </div>

        <div className="container-custom relative">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="animate-slide-up text-4xl font-bold sm:text-5xl lg:text-6xl">
              Convert Documents,{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Instantly
              </span>
            </h1>
            <p className="mt-6 text-lg text-foreground/70 sm:text-xl">
              Transform your files effortlessly. Convert images to PDF, PDF to
              Word, and more. No registration needed, 100% secure.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/tools" className="btn-primary">
                Start Converting
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <a href="#tools" className="btn-secondary">
                Explore Tools
              </a>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-fade-in rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-8"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="h-32 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section
        id="tools"
        className="border-t border-border bg-background py-20 sm:py-32"
      >
        <div className="container-custom">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Powerful Tools for Every Need
            </h2>
            <p className="mt-4 text-foreground/70">
              Choose from our comprehensive suite of document conversion tools
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={index}
                  to={tool.href}
                  className="group card-base"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-3 transition-all duration-200 group-hover:from-primary/20 group-hover:to-accent/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {tool.title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/70">
                    {tool.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary transition-all duration-200 group-hover:gap-3">
                    Get started
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="border-t border-border bg-gradient-to-br from-primary-50 via-background to-background py-20 sm:py-32"
      >
        <div className="container-custom">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Why Choose Us</h2>
            <p className="mt-4 text-foreground/70">
              The fastest and most secure way to convert your documents
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card-base text-center">
                  <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-br from-primary/10 to-accent/10 p-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-foreground/70">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-background py-16 sm:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-r from-primary to-accent p-12 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-primary-foreground/90">
              Convert your first document today, no sign up required
            </p>
            <Link to="/tools" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary-foreground px-8 py-3 font-semibold text-primary transition-all duration-200 hover:shadow-lg active:scale-95">
              Start Converting Now
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container-custom">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                  <FileText className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">PDF Pro</span>
              </div>
              <p className="text-sm text-foreground/70">
                Fast, secure document conversion
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Tools</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                    Images to PDF
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                    PDF to Word
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                    Merge PDF
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8">
            <p className="text-center text-sm text-foreground/70">
              © 2024 PDF Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
