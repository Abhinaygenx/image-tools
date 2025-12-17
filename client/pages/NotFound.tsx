import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-background to-background">
      <div className="text-center">
        <div className="mb-6 text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          404
        </div>
        <h1 className="text-3xl font-bold text-foreground">Page Not Found</h1>
        <p className="mt-3 text-lg text-foreground/70 mb-8">
          The page you're looking for doesn't exist
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <Home className="h-5 w-5" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
