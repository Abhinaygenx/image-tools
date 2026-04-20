import { useState } from "react";
import { Link } from "react-router-dom";
import { ToolCard } from "@/components/ToolCard";
import {
    FileText,
    Image,
    Download,
    Lock,
    Search,
    School,
    BrainCircuit,
    Calculator,
    FileBadge,
    Sparkles,
    ArrowRight,
    LayoutGrid,
    Video,
    Music,
    Image as ImageIcon,
    Timer,
    Shrink,
    Scissors,
    RotateCw,
    Unlock,
    Stamp,
    Trash2,
    Table,
    Presentation,
    Home,
} from "lucide-react";


import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ToolsMarketplace() {
    const [searchQuery, setSearchQuery] = useState("");

    const allTools = [
        // PDF Tools
        {
            id: "pdf-1",
            category: "pdf",
            title: "Images to PDF",
            description: "Convert multiple images (JPG, PNG) into a single PDF.",
            icon: Image,
            to: "/tools/pdf/images-to-pdf",
            color: "from-blue-500 to-blue-600",
            lightColor: "from-blue-50 to-blue-100",
        },
        {
            id: "pdf-2",
            category: "pdf",
            title: "PDF to Word",
            description: "Convert PDF documents to editable Word format.",
            icon: FileText,
            to: "/tools/converters/pdf-to-word",
            color: "from-purple-500 to-purple-600",
            lightColor: "from-purple-50 to-purple-100",
        },
        {
            id: "pdf-3",
            category: "pdf",
            title: "Merge PDF",
            description: "Combine multiple PDF files into a single document.",
            icon: LayoutGrid,
            to: "/tools/pdf/merge-pdf",
            color: "from-green-500 to-green-600",
            lightColor: "from-green-50 to-green-100",
        },
        {
            id: "pdf-4",
            category: "pdf",
            title: "Compress PDF",
            description: "Reduce file size while maintaining quality.",
            icon: Download,
            to: "/tools/pdf/compress-pdf",
            color: "from-orange-500 to-orange-600",
            lightColor: "from-orange-50 to-orange-100",
        },
        {
            id: "pdf-5",
            category: "pdf",
            title: "Protect PDF",
            description: "Encrypt your PDF with a password.",
            icon: Lock,
            to: "/tools/pdf/protect-pdf",
            color: "from-red-500 to-red-600",
            lightColor: "from-red-50 to-red-100",
        },
        {
            id: "pdf-7",
            category: "pdf",
            title: "Split PDF",
            description: "Extract pages or split your PDF file.",
            icon: Scissors,
            to: "/tools/pdf/split",
            color: "from-teal-500 to-teal-600",
            lightColor: "from-teal-50 to-teal-100",
        },
        {
            id: "pdf-8",
            category: "pdf",
            title: "Rotate PDF",
            description: "Rotate PDF pages 90, 180 or 270 degrees.",
            icon: RotateCw,
            to: "/tools/pdf/rotate",
            color: "from-cyan-500 to-cyan-600",
            lightColor: "from-cyan-50 to-cyan-100",
        },
        {
            id: "pdf-9",
            category: "pdf",
            title: "Unlock PDF",
            description: "Remove password protection from PDF.",
            icon: Unlock,
            to: "/tools/pdf/unlock-pdf",
            color: "from-indigo-500 to-indigo-600",
            lightColor: "from-indigo-50 to-indigo-100",
        },
        {
            id: "pdf-10",
            category: "pdf",
            title: "Add Watermark",
            description: "Stamp text over your PDF pages.",
            icon: Stamp,
            to: "/tools/pdf/watermark",
            color: "from-blue-400 to-blue-500",
            lightColor: "from-blue-50 to-blue-100",
        },
        {
            id: "pdf-11",
            category: "pdf",
            title: "Remove Pages",
            description: "Delete unwanted pages from your PDF.",
            icon: Trash2,
            to: "/tools/pdf/remove-pages",
            color: "from-red-400 to-red-500",
            lightColor: "from-red-50 to-red-100",
        },
        // Converter Tools
        {
            id: "conv-1",
            category: "converters",
            title: "Word to PDF",
            description: "Convert DOC and DOCX to PDF.",
            icon: FileText,
            to: "/tools/converters/word-to-pdf",
            color: "from-blue-600 to-blue-700",
            lightColor: "from-blue-50 to-blue-100",
        },
        {
            id: "conv-2",
            category: "converters",
            title: "PDF to Word",
            description: "Convert PDF to DOCX.",
            icon: FileText,
            to: "/tools/converters/pdf-to-word",
            color: "from-blue-500 to-blue-600",
            lightColor: "from-blue-50 to-blue-100",
        },
        {
            id: "conv-3",
            category: "converters",
            title: "Excel to PDF",
            description: "Convert Sheets to PDF.",
            icon: Table,
            to: "/tools/converters/excel-to-pdf",
            color: "from-green-600 to-green-700",
            lightColor: "from-green-50 to-green-100",
        },
        {
            id: "conv-4",
            category: "converters",
            title: "PDF to Excel",
            description: "Convert PDF to Sheets.",
            icon: Table,
            to: "/tools/converters/pdf-to-excel",
            color: "from-green-500 to-green-600",
            lightColor: "from-green-50 to-green-100",
        },
        {
            id: "conv-5",
            category: "converters",
            title: "PPT to PDF",
            description: "Convert Slides to PDF.",
            icon: Presentation,
            to: "/tools/converters/ppt-to-pdf",
            color: "from-orange-600 to-orange-700",
            lightColor: "from-orange-50 to-orange-100",
        },
        {
            id: "conv-6",
            category: "converters",
            title: "PDF to PPT",
            description: "Convert PDF to Slides.",
            icon: Presentation,
            to: "/tools/converters/pdf-to-ppt",
            color: "from-orange-500 to-orange-600",
            lightColor: "from-orange-50 to-orange-100",
        },
        {
            id: "conv-7",
            category: "converters",
            title: "Text to PDF",
            description: "Convert plain text to PDF.",
            icon: FileText,
            to: "/tools/converters/txt-to-pdf",
            isNew: true,
            color: "from-slate-500 to-slate-600",
            lightColor: "from-slate-50 to-slate-100",
        },
        {
            id: "conv-8",
            category: "converters",
            title: "PDF to Text",
            description: "Extract text from PDF.",
            icon: FileText,
            to: "/tools/converters/pdf-to-txt",
            isNew: true,
            color: "from-slate-600 to-slate-700",
            lightColor: "from-slate-50 to-slate-100",
        },
        // Academic Tools
        {
            id: "acad-1",
            category: "academic",
            title: "GPA Calculator",
            description: "Calculate your semester and cumulative GPA easily.",
            icon: Calculator,
            to: "/tools/academic/gpa-calculator",
            isNew: true,
            color: "from-emerald-500 to-emerald-600",
            lightColor: "from-emerald-50 to-emerald-100",
        },
        {
            id: "acad-2",
            category: "academic",
            title: "Resume Builder",
            description: "Create a professional student resume in minutes.",
            icon: FileBadge,
            to: "/tools/academic/resume-builder",
            available: false,
        },
        // AI Tools
        {
            id: "ai-1",
            category: "ai",
            title: "Text Summarizer",
            description: "Summarize long articles and notes with AI.",
            icon: BrainCircuit,
            to: "/tools/ai/summarizer",
            isPremium: true,
            color: "from-violet-500 to-violet-600",
            lightColor: "from-violet-50 to-violet-100",
        },
        {
            id: "ai-2",
            category: "ai",
            title: "Lecture Notes AI",
            description: "Convert lecture recordings into structured notes.",
            icon: Sparkles,
            to: "/tools/ai/lecture-notes",
            isPremium: true,
            available: false,
        },
        // Media Tools
        {
            id: "media-1",
            category: "media",
            title: "JPG to PNG",
            description: "Convert JPG images to transparent PNG format.",
            icon: ImageIcon,
            to: "/tools/image/jpg-to-png",
            color: "from-pink-500 to-pink-600",
            lightColor: "from-pink-50 to-pink-100",
        },
        {
            id: "media-2",
            category: "media",
            title: "PNG to JPG",
            description: "Convert PNG images to JPG format.",
            icon: ImageIcon,
            to: "/tools/image/png-to-jpg",
            color: "from-pink-500 to-pink-600",
            lightColor: "from-pink-50 to-pink-100",
        },
        {
            id: "media-5",
            category: "media",
            title: "WebP to PNG",
            description: "Convert WebP images to PNG format.",
            icon: ImageIcon,
            to: "/tools/image/webp-to-png",
            isNew: true,
            color: "from-purple-500 to-purple-600",
            lightColor: "from-purple-50 to-purple-100",
        },
        {
            id: "media-6",
            category: "media",
            title: "PNG to WebP",
            description: "Convert PNG images to WebP format.",
            icon: ImageIcon,
            to: "/tools/image/png-to-webp",
            isNew: true,
            color: "from-purple-500 to-purple-600",
            lightColor: "from-purple-50 to-purple-100",
        },
        {
            id: "media-3",
            category: "media",
            title: "Image Compressor",
            description: "Reduce image file size without losing quality.",
            icon: Shrink,
            to: "/tools/image/compress",
            isNew: true,
            color: "from-orange-500 to-orange-600",
            lightColor: "from-orange-50 to-orange-100",
        },
        {
            id: "media-4",
            category: "media",
            title: "MP4 to MP3",
            description: "Extract audio from video files.",
            icon: Video,
            to: "/tools/video/mp4-to-mp3",
            isNew: true,
            color: "from-indigo-500 to-indigo-600",
            lightColor: "from-indigo-50 to-indigo-100",
        },
        // Extra PDF
        {
            id: "pdf-6",
            category: "pdf",
            title: "PDF to Image",
            description: "Convert PDF pages to high-quality images.",
            icon: FileText,
            to: "/tools/pdf/pdf-to-image",
            isNew: true,
            color: "from-blue-500 to-blue-600",
            lightColor: "from-blue-50 to-blue-100",
        },
        // Extra Academic
        {
            id: "acad-3",
            category: "academic",
            title: "Pomodoro Timer",
            description: "Boost productivity with focused study intervals.",
            icon: Timer,
            to: "/tools/academic/pomodoro",
            isNew: true,
            color: "from-red-500 to-red-600",
            lightColor: "from-red-50 to-red-100",
        },
    ];

    const filteredTools = allTools.filter((tool) =>
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pdfTools = filteredTools.filter((t) => t.category === "pdf");
    const academicTools = filteredTools.filter((t) => t.category === "academic");
    const aiTools = filteredTools.filter((t) => t.category === "ai");
    const mediaTools = filteredTools.filter((t) => t.category === "media");

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
                <div className="container-custom flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                            <School className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="hidden text-xl font-bold text-foreground sm:inline">
                            StudentHub
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="btn-ghost flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                    </div>
                    {/* User Dropdown for consistency */}
                    {/* Note: In a real app we'd extract this header to a component */}
                </div>
            </header >

            <main className="container-custom py-12">
                {/* Hero Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Student Productivity Marketplace
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        All the tools you need for academic success, from PDF utilities to AI-powered study aids.
                    </p>

                    <div className="mt-8 max-w-md mx-auto relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                            placeholder="Search for tools (e.g., 'Merge PDF', 'GPA')..."
                            className="pl-10 h-12 text-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Categories Tabs */}
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto mb-10 h-auto p-1 bg-muted/50 rounded-xl overflow-x-auto sm:overflow-visible">
                        <TabsTrigger value="all" className="py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">All</TabsTrigger>
                        <TabsTrigger value="image" className="gap-2"><ImageIcon className="h-4 w-4" /> Image & Audio</TabsTrigger>
                        <TabsTrigger value="converters" className="gap-2"><FileText className="h-4 w-4" /> Converters</TabsTrigger>
                        <TabsTrigger value="academic" className="gap-2 py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Academic</TabsTrigger>
                        <TabsTrigger value="ai" className="py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">AI</TabsTrigger>
                        <TabsTrigger value="media" className="py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Media</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-12 animate-in fade-in-50 duration-500">
                        {pdfTools.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="p-2 rounded-md bg-blue-100 text-blue-600">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold">PDF & Documents</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pdfTools.map((tool) => <ToolCard key={tool.id} {...tool} />)}
                                </div>
                            </section>
                        )}

                        {academicTools.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-6 mt-12">
                                    <div className="p-2 rounded-md bg-emerald-100 text-emerald-600">
                                        <School className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Academic Utilities</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {academicTools.map((tool) => <ToolCard key={tool.id} {...tool} />)}
                                </div>
                            </section>
                        )}

                        {aiTools.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-6 mt-12">
                                    <div className="p-2 rounded-md bg-violet-100 text-violet-600">
                                        <BrainCircuit className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold">AI Productivity</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {aiTools.map((tool) => <ToolCard key={tool.id} {...tool} />)}
                                </div>
                            </section>
                        )}

                        {mediaTools.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-6 mt-12">
                                    <div className="p-2 rounded-md bg-pink-100 text-pink-600">
                                        <ImageIcon className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Media Converters</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {mediaTools.map((tool) => <ToolCard key={tool.id} {...tool} />)}
                                </div>
                            </section>
                        )}
                    </TabsContent>

                    <TabsContent value="image" className="mt-6 animate-in fade-in-50 duration-500">
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredTools.filter(t => t.category === "media").map(tool => (
                                <ToolCard key={tool.id} {...tool} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="converters" className="mt-6 animate-in fade-in-50 duration-500">
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredTools.filter(t => t.category === "converters").map(tool => (
                                <ToolCard key={tool.id} {...tool} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="academic" className="animate-in fade-in-50 duration-500">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {academicTools.map((tool) => <ToolCard key={tool.id} {...tool} />)}
                        </div>
                    </TabsContent>

                    <TabsContent value="ai" className="animate-in fade-in-50 duration-500">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {aiTools.map((tool) => <ToolCard key={tool.id} {...tool} />)}
                        </div>
                    </TabsContent>

                    <TabsContent value="media" className="animate-in fade-in-50 duration-500">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mediaTools.map((tool) => <ToolCard key={tool.id} {...tool} />)}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div >
    );
}
