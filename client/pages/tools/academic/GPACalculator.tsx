import { useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, Plus, Trash2, RotateCcw, ArrowLeft, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "sonner";
import { toast } from "sonner";

interface Course {
    id: string;
    name: string;
    credits: number;
    grade: string;
}

const GRADE_POINTS: Record<string, number> = {
    "10": 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "0": 0,
};

export default function GPACalculator() {
    const [courses, setCourses] = useState<Course[]>([
        { id: "1", name: "Course 1", credits: 4, grade: "10" },
        { id: "2", name: "Course 2", credits: 3, grade: "9" },
        { id: "3", name: "Course 3", credits: 3, grade: "8" },
        { id: "4", name: "Course 4", credits: 2, grade: "7" },
    ]);

    const addCourse = () => {
        setCourses([...courses, { id: Date.now().toString(), name: `Course ${courses.length + 1}`, credits: 3, grade: "8" }]);
    };

    const removeCourse = (id: string) => {
        setCourses(courses.filter((c) => c.id !== id));
    };

    const updateCourse = (id: string, field: keyof Course, value: string | number) => {
        setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    };

    const calculateGPA = () => {
        let totalPoints = 0;
        let totalCredits = 0;

        courses.forEach((course) => {
            const points = GRADE_POINTS[course.grade] || 0;
            totalPoints += points * course.credits;
            totalCredits += course.credits;
        });

        return totalCredits === 0 ? "0.00" : (totalPoints / totalCredits).toFixed(2);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
                <div className="container-custom flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                            <Calculator className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="hidden text-xl font-bold text-foreground sm:inline">
                            GPA Calc
                        </span>
                    </Link>
                    <Link to="/tools" className="btn-ghost flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Back to Tools</span>
                    </Link>
                </div>
            </header>

            <main className="container-custom py-12">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold sm:text-4xl text-foreground">GPA Calculator</h1>
                            <p className="text-muted-foreground mt-1">Calculate your semester or cumulative GPA easily</p>
                        </div>
                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col items-center min-w-[200px]">
                            <span className="text-sm font-medium text-foreground/70">Your GPA</span>
                            <span className="text-4xl font-bold text-primary">{calculateGPA()}</span>
                        </div>
                    </div>

                    <div className="card-base p-6">
                        <div className="grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-muted-foreground px-2">
                            <div className="col-span-6 sm:col-span-5">Course Name</div>
                            <div className="col-span-3 sm:col-span-2 text-center">Credits</div>
                            <div className="col-span-3 sm:col-span-2 text-center">Grade</div>
                            <div className="col-span-1 sm:col-span-1"></div>
                        </div>

                        <div className="space-y-3">
                            {courses.map((course) => (
                                <div key={course.id} className="grid grid-cols-12 gap-4 items-center animate-in fade-in slide-in-from-bottom-2">
                                    <div className="col-span-6 sm:col-span-5">
                                        <Input
                                            value={course.name}
                                            onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                                            placeholder="Subject Name"
                                        />
                                    </div>
                                    <div className="col-span-3 sm:col-span-2">
                                        <Input
                                            type="number"
                                            min="0"
                                            max="20"
                                            value={course.credits}
                                            onChange={(e) => updateCourse(course.id, "credits", Number(e.target.value))}
                                            className="text-center"
                                        />
                                    </div>
                                    <div className="col-span-3 sm:col-span-2">
                                        <Select
                                            value={course.grade}
                                            onValueChange={(val) => updateCourse(course.id, "grade", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.keys(GRADE_POINTS).map((g) => (
                                                    <SelectItem key={g} value={g}>{g}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-1 sm:col-span-1 flex justify-center">
                                        <button
                                            onClick={() => removeCourse(course.id)}
                                            className="text-destructive/50 hover:text-destructive transition-colors p-2"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <button onClick={addCourse} className="btn-secondary flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Add Course
                            </button>
                            <button onClick={() => setCourses([])} className="btn-ghost text-destructive hover:text-destructive hover:bg-destructive/10">
                                <RotateCcw className="h-4 w-4 mr-2" /> Reset
                            </button>
                            <button onClick={() => toast("GPA Saved locally!")} className="btn-primary ml-auto flex items-center gap-2">
                                <Save className="h-4 w-4" /> Save Results
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
