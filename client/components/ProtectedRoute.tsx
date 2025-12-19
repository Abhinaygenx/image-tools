import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
    children: JSX.Element;
    requirePro?: boolean;
}

export default function ProtectedRoute({ children, requirePro = false }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        // Redirect to login, but save the current location they were trying to access
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requirePro && !user.isPro) {
        return <Navigate to="/pricing" replace />;
    }

    return children;
}
