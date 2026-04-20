import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Loader, CheckCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

type AuthStep = "email" | "sent";

export default function Login() {
    const [email, setEmail] = useState("");
    const [step, setStep] = useState<AuthStep>("email");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const from = location.state?.from?.pathname || "/tools";

    const handleSendMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast({
                title: "Email Required",
                description: "Please enter your email address.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}${from}`,
                }
            });

            if (error) throw error;

            setStep("sent");
            toast({
                title: "Magic Link Sent!",
                description: "Check your email and click the link to sign in.",
            });
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Failed to Send",
                description: error.message || "Something went wrong.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}${from}`,
                }
            });

            if (error) throw error;

            toast({
                title: "Email Resent!",
                description: "Check your inbox for the new magic link.",
            });
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Resend Failed",
                description: error.message || "Could not resend email.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4">
            <Card className="w-full max-w-md">
                {step === "email" ? (
                    <>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                            <CardDescription>
                                Enter your email to receive a magic sign-in link
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSendMagicLink}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            required
                                            className="pl-10"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <Button className="w-full" type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <><Loader className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                                    ) : (
                                        <><Mail className="mr-2 h-4 w-4" /> Send Magic Link</>
                                    )}
                                </Button>
                                <p className="text-center text-xs text-muted-foreground">
                                    We'll email you a magic link to sign in or create your account.
                                </p>
                            </CardFooter>
                        </form>
                    </>
                ) : (
                    <>
                        <CardHeader className="space-y-1 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
                            <CardDescription>
                                We've sent a magic link to <span className="font-medium text-foreground">{email}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
                                <p>Click the link in your email to sign in.</p>
                                <p className="mt-1">The link will expire in 1 hour.</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleResend}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <><Loader className="mr-2 h-4 w-4 animate-spin" /> Resending...</>
                                ) : (
                                    "Resend Email"
                                )}
                            </Button>
                            <button
                                type="button"
                                onClick={() => setStep("email")}
                                className="text-sm text-muted-foreground hover:text-primary hover:underline flex items-center justify-center gap-1"
                            >
                                <ArrowLeft className="h-3 w-3" /> Use a different email
                            </button>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    );
}
