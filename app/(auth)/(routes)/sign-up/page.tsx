import RegisterForm from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up | Sp Fair Value",
    description: "Sign up for an account",
};

const SignUpPage = () => {
    return (
        <RegisterForm />
    );
};

export default SignUpPage;