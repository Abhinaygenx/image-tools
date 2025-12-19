import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Zap } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Pricing() {
    const { user, upgradeToPro } = useAuth();
    const navigate = useNavigate();

    const handleUpgrade = () => {
        // Redirect to Stripe Payment Link
        const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
        if (paymentLink) {
            window.location.href = paymentLink;
        } else {
            console.error("Stripe payment link not configured");
            upgradeToPro(); // Fallback for demo
            setTimeout(() => navigate("/tools"), 500);
        }
    };

    return (
        <div className="min-h-screen bg-background py-20 px-4">
            <div className="mx-auto max-w-5xl text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                    Simple, Transparent Pricing
                </h1>
                <p className="text-xl text-muted-foreground">
                    Unlock the full power of StudentHub with our Pro plan.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <Card className="relative overflow-hidden border-2 border-muted">
                    <CardHeader>
                        <CardTitle className="text-2xl">Basic</CardTitle>
                        <CardDescription>Essential tools for every student.</CardDescription>
                        <div className="mt-4 text-4xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Basic PDF Merge & Compress</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> GPA Calculator</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Resume Builder (Basic Templates)</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/tools">Go to Tools</Link>
                        </Button>
                    </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="relative overflow-hidden border-2 border-primary shadow-xl">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
                        MOST POPULAR
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            Pro Student <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        </CardTitle>
                        <CardDescription>Supercharge your productivity.</CardDescription>
                        <div className="mt-4 text-4xl font-bold">$4.99<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> <strong>All Basic Features</strong></li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Unlimited PDF Compression</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> <strong>AI Text Summarizer</strong></li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Image Compressor & Converters</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Priority Processing</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        {user?.isPro ? (
                            <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                                Current Plan
                            </Button>
                        ) : (
                            <Button className="w-full" size="lg" onClick={handleUpgrade} disabled={!user}>
                                {user ? "Upgrade to Pro" : "Sign in to Upgrade"}
                            </Button>
                        )}
                    </CardFooter>
                    {!user && (
                        <p className="text-xs text-center text-muted-foreground pb-4">
                            Please <Link to="/login" className="underline">sign in</Link> first.
                        </p>
                    )}
                </Card>
            </div>
        </div>
    );
}
