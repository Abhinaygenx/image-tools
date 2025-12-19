import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have this or standard textarea
import { Save, RefreshCw } from "lucide-react";

export default function PricingManager() {
    const [plans, setPlans] = useState([
        {
            id: "free",
            name: "Free",
            price: "0",
            description: "Basic tools for everyone.",
            features: ["Basic PDF Tools", "3 AI Credits/day", "Standard Support"]
        },
        {
            id: "pro",
            name: "Pro",
            price: "9.99",
            description: "Unlock full power.",
            features: ["Unlimited PDF Tools", "Unlimited AI Credits", "Priority Support", "No Ads"]
        }
    ]);

    const [hasChanges, setHasChanges] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedPlans = localStorage.getItem("admin_pricing_plans");
        if (savedPlans) {
            setPlans(JSON.parse(savedPlans));
        }
    }, []);

    const handlePlanChange = (index: number, field: string, value: string) => {
        const newPlans = [...plans];
        (newPlans[index] as any)[field] = value;
        setPlans(newPlans);
        setHasChanges(true);
    };

    const handleFeatureChange = (planIndex: number, featureIndex: number, value: string) => {
        const newPlans = [...plans];
        newPlans[planIndex].features[featureIndex] = value;
        setPlans(newPlans);
        setHasChanges(true);
    };

    const saveChanges = () => {
        localStorage.setItem("admin_pricing_plans", JSON.stringify(plans));
        setHasChanges(false);
        alert("Pricing plans updated!");
        // In a real app, this would push to Supabase or a JSON config file on server
    };

    return (
        <div className="space-y-8 max-w-5xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Pricing Manager</h2>
                    <p className="text-muted-foreground">Update your Plan details.</p>
                </div>
                <Button onClick={saveChanges} disabled={!hasChanges} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {plans.map((plan, i) => (
                    <Card key={plan.id}>
                        <CardHeader>
                            <CardTitle>Edit {plan.id.toUpperCase()} Plan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Plan Name</Label>
                                <Input
                                    value={plan.name}
                                    onChange={(e) => handlePlanChange(i, 'name', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Price ($)</Label>
                                <Input
                                    value={plan.price}
                                    onChange={(e) => handlePlanChange(i, 'price', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input
                                    value={plan.description}
                                    onChange={(e) => handlePlanChange(i, 'description', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Features</Label>
                                {plan.features.map((feat, fIndex) => (
                                    <Input
                                        key={fIndex}
                                        value={feat}
                                        className="mb-2"
                                        onChange={(e) => handleFeatureChange(i, fIndex, e.target.value)}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
