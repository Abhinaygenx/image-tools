import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CreditCard, LogOut, Settings, BarChart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout() {
    const { logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground";
    };

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
                <div className="p-6 border-b border-border">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold">Admin Panel</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive("/admin")}`}
                    >
                        <BarChart className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/users"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive("/admin/users")}`}
                    >
                        <Users className="h-5 w-5" />
                        Users
                    </Link>
                    <Link
                        to="/admin/pricing"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive("/admin/pricing")}`}
                    >
                        <CreditCard className="h-5 w-5" />
                        Pricing & Plans
                    </Link>
                    <Link
                        to="/admin/settings"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive("/admin/settings")}`}
                    >
                        <Settings className="h-5 w-5" />
                        Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-border">
                    <button
                        onClick={() => logout()}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-lg font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 md:hidden">
                    <span className="font-bold">Admin Panel</span>
                    {/* Mobile menu trigger could go here */}
                </header>
                <main className="flex-1 p-6 md:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
