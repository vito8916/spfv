'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {LoaderCircle} from "lucide-react";
import {
    ResendVerificationFormValues,
    resendVerificationSchema
} from "@/lib/validations/auth";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {useRouter} from "next/navigation";
import { resendVerificationEmailAction} from "@/app/actions/auth";
import {toast} from "sonner";

const ResendVerificationForm = () => {
    const [formMessage, setFormMessage] = useState("");
    const [hasMessage, setHasMessage] = useState(false);
    const [status, setStatus] = useState("");
    const router = useRouter();


    const form = useForm<ResendVerificationFormValues>({
        resolver: zodResolver(resendVerificationSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: ResendVerificationFormValues) => {
        try {
            const formData = new FormData();
            formData.append("email", data.email);
            const result = await resendVerificationEmailAction(formData);
            setFormMessage(result.message);
            setStatus(result.status);
            setHasMessage(true);

            toast.success(result.message);
            router.push(result.redirect);

        } catch (error) {
            console.error(error);
            toast.error(
                formMessage || "Unknown error, please try again later"
            );
        }
    };

    const {isSubmitting} = form.formState;
    return (
        <Card className="rounded-xl">
            <CardHeader className="px-10 pt-8 pb-0 text-center">
                <CardTitle className="text-xl">Resend Verification Email</CardTitle>
                <CardDescription>Enter your email to receive a new verification link</CardDescription>
                <div className={`text-sm text-center ${status === "error" ? "text-red-500" : "text-green-500"}`}>
                    {hasMessage && formMessage}
                </div>
            </CardHeader>
            <CardContent className="px-10 py-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your email" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={isSubmitting}>
                                {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin"/>}
                                Resend Email
                            </Button>
                        </div>

                        <div className="text-muted-foreground text-center text-sm">
                            You have an account?{' '}
                            <Link href={"/sign-in"} tabIndex={5}>
                                Sign in
                            </Link>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default ResendVerificationForm;