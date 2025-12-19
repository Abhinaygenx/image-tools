import { Link } from "react-router-dom";
import {
  School,
  FileText,
  Image,
  Zap,
  Shield,
  ChevronRight,
  BrainCircuit,
  Calculator,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon, CreditCard, Home } from "lucide-react";

export default function Index() {
  const { user, isLoading, logout } = useAuth();

  const featuredTools = [
    {
      icon: Calculator,
      title: "GPA Calculator",
      description: "Calculate your semester and cumulative GPA instantly",
      href: "/tools/academic/gpa-calculator",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      icon: FileText,
      title: "PDF to Word",
      description: "Convert PDF documents to editable Word format",
      href: "/tools/pdf/pdf-to-word",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: BrainCircuit,
      title: "AI Summarizer",
      description: "Summarize long articles and notes instantly with AI",
      href: "/tools/ai/summarizer",
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container-custom flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent transition-transform group-hover:scale-105">
              <School className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              StudentHub
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <Link to="/tools" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Tools
              </Link>
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </Link>
            </div>

            {!isLoading && (
              user ? (
                <div className="flex items-center gap-4">
                  <Link to="/tools">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10 border border-border">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.email?.split('@')[0]}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-default">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>{user.isPro ? "Pro Plan" : "Free Plan"}</span>
                        {user.isPro && <span className="ml-auto text-xs bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded font-bold">PRO</span>}
                      </DropdownMenuItem>
                      {user.role === 'admin' && (
                        <>
                          <DropdownMenuSeparator />
                          <Link to="/admin">
                            <DropdownMenuItem className="cursor-pointer">
                              <Shield className="mr-2 h-4 w-4" />
                              <span>Admin Panel</span>
                            </DropdownMenuItem>
                          </Link>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link to="/login">
                  <Button>Sign In</Button>
                </Link>
              )
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32">
          {/* Background Blobs */}
          <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[100px]" />
          </div>

          <div className="container-custom relative">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 animate-fade-in">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                The Ultimate Student Productivity Platform
              </div>

              <h1 className="text-4xl font-extrabold sm:text-6xl tracking-tight mb-6 animate-slide-up">
                Master Your Studies with{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  StudentHub
                </span>
              </h1>

              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "100ms" }}>
                One platform for all your academic needs. Free PDF tools, GPA calculators,
                AI study aids, and more. Built to help you succeed.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
                <Link to="/tools">
                  <Button size="lg" className="h-12 px-8 text-base">
                    Explore All Tools <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/tools/pdf/merge-pdf">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    Merge PDF
                  </Button>
                </Link>
              </div>
            </div>

            {/* Featured Tools Grid */}
            <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 animate-fade-in" style={{ animationDelay: "300ms" }}>
              {featuredTools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={index}
                    to={tool.href}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className={`mb-4 inline-flex rounded-xl ${tool.bg} p-3 ${tool.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                    <p className="text-muted-foreground text-sm">{tool.description}</p>
                    <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                      Try now <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section id="features" className="py-20 border-t border-border bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Students Love Us</h2>
              <p className="text-muted-foreground">Everything you need to boost your productivity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6">
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground text-sm">
                  Instant results for GPA calculations and document conversions. No waiting around.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
                <p className="text-muted-foreground text-sm">
                  Your files are encrypted and automatically deleted after 1 hour. We respect your privacy.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="h-12 w-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center mb-4">
                  <Laptop className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">All-in-One Platform</h3>
                <p className="text-muted-foreground text-sm">
                  Stop switching between 10 different websites. Get all your tools in one place.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 bg-muted/50">
        <div className="container-custom text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} StudentHub. Built for student success.</p>
        </div>
      </footer>
    </div>
  );
}
