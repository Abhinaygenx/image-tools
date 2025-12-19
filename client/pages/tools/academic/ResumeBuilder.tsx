import { useState } from "react";
import { Link } from "react-router-dom";
import { FileBadge, ArrowLeft, Download, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Experience {
    id: string;
    role: string;
    company: string;
    duration: string;
    description: string;
}

export default function ResumeBuilder() {
    const [personalInfo, setPersonalInfo] = useState({
        fullName: "John Doe",
        email: "john@example.com",
        phone: "+1 234 567 890",
        summary: "Motivated student...",
    });

    const [experience, setExperience] = useState<Experience[]>([
        {
            id: "1",
            role: "Intern",
            company: "Tech Corp",
            duration: "Summer 2024",
            description: "Assisted in web development...",
        },
    ]);

    const addExperience = () => {
        setExperience([
            ...experience,
            {
                id: Date.now().toString(),
                role: "Role",
                company: "Company",
                duration: "Date",
                description: "Description",
            },
        ]);
    };

    const updateExperience = (id: string, field: keyof Experience, value: string) => {
        setExperience(experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
    };

    const removeExperience = (id: string) => {
        setExperience(experience.filter((e) => e.id !== id));
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
                <div className="container-custom flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                            <FileBadge className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="hidden text-xl font-bold text-foreground sm:inline">
                            Resume Builder
                        </span>
                    </Link>
                    <Link to="/tools" className="btn-ghost flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Back to Tools</span>
                    </Link>
                </div>
            </header>

            <main className="container-custom py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor Side */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                placeholder="Full Name"
                                value={personalInfo.fullName}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                            />
                            <Input
                                placeholder="Email"
                                value={personalInfo.email}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                            />
                            <Input
                                placeholder="Phone"
                                value={personalInfo.phone}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                            />
                            <Textarea
                                placeholder="Professional Summary"
                                value={personalInfo.summary}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Experience</CardTitle>
                            <Button size="sm" onClick={addExperience} variant="outline">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {experience.map((exp) => (
                                <div key={exp.id} className="space-y-3 relative border p-4 rounded-lg">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-2 right-2 text-destructive"
                                        onClick={() => removeExperience(exp.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        placeholder="Role"
                                        value={exp.role}
                                        onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                                    />
                                    <Input
                                        placeholder="Company"
                                        value={exp.company}
                                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                    />
                                    <Input
                                        placeholder="Duration"
                                        value={exp.duration}
                                        onChange={(e) => updateExperience(exp.id, "duration", e.target.value)}
                                    />
                                    <Textarea
                                        placeholder="Description"
                                        value={exp.description}
                                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Side */}
                <div className="lg:sticky lg:top-24 h-fit">
                    <div className="bg-white text-black p-8 rounded-lg shadow-xl min-h-[800px] border border-border/10">
                        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{personalInfo.fullName}</h1>
                        <div className="text-sm text-gray-600 mb-6 flex gap-4">
                            <span>{personalInfo.email}</span>
                            <span>{personalInfo.phone}</span>
                        </div>

                        <Separator className="bg-gray-300 my-4" />

                        <div className="mb-6">
                            <h2 className="text-lg font-bold uppercase text-gray-800 mb-2">Summary</h2>
                            <p className="text-gray-700 leading-relaxed text-sm">{personalInfo.summary}</p>
                        </div>

                        <Separator className="bg-gray-300 my-4" />

                        <div>
                            <h2 className="text-lg font-bold uppercase text-gray-800 mb-4">Experience</h2>
                            <div className="space-y-6">
                                {experience.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-gray-900">{exp.role}</h3>
                                            <span className="text-sm text-gray-500 italic">{exp.duration}</span>
                                        </div>
                                        <div className="text-gray-700 font-medium mb-1">{exp.company}</div>
                                        <p className="text-sm text-gray-600">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button className="w-full sm:w-auto">
                            <Download className="mr-2 h-4 w-4" /> Download PDF (Mock)
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
