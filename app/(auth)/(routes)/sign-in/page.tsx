import { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
    title: "Sign In | Sp Fair Value",
    description: "Sign in to your account",
};

const SignInPage = () => {
    return (
        <LoginForm />
    );
};

export default SignInPage;