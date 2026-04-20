import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Redirect Register to Login since OTP handles both signup and login
export default function Register() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/login", { replace: true });
    }, [navigate]);

    return null;
}
