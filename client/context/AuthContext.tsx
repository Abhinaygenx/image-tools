import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

interface User {
    id: string;
    email: string;
    isPro: boolean;
    credits: number;
    role: 'admin' | 'user';
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    login: (email: string) => Promise<void>; // Kept for interface compatibility, though mostly handled by pages
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 1. Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                fetchProfile(session.user);
            } else {
                setIsLoading(false);
            }
        });

        // 2. Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                fetchProfile(session.user);
            } else {
                setUser(null);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (authUser: SupabaseUser) => {
        try {
            // Check if profile exists, if not create basic one (Mocking DB logic if table doesn't exist yet)
            // Ideally we fetch from 'profiles' table
            // For now, allow UI to work even if DB is empty by deriving from authUser

            // Mock DB fetch for MVP until table created
            const profile: User = {
                id: authUser.id,
                email: authUser.email || "",
                isPro: authUser.email?.includes("pro") || false, // Mock Pro based on email for testing
                credits: 3, // Default free credits
                role: (authUser.email?.includes("admin") || authUser.email === "abhinaykumar5432@gmail.com") ? 'admin' : 'user', // Mock Admin based on email
            };

            setUser(profile);
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string) => {
        // This is a placeholder since login logic is in Login.tsx
        console.log("Login triggered via context for:", email);
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const refreshProfile = async () => {
        if (session?.user) {
            await fetchProfile(session.user);
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, isLoading, login, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
