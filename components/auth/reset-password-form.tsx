'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {LoaderCircle} from "lucide-react";
import {
    ResetPasswordFormValues,
    resetPasswordSchema
} from "@/lib/validations/auth";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {resetPasswordAction} from "@/app/actions/actions";
import {toast} from "sonner";
import {useState} from "react";
import {useRouter} from "next/navigation";

const ResetPasswordForm = () => {
    const [formMessage, setFormMessage] = useState("");
    const router = useRouter();

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: ResetPasswordFormValues) => {
        try {
            const formData = new FormData();
            formData.append('password', data.password);
            formData.append('confirmPassword', data.confirmPassword);
            console.log(formData);

            const result = await resetPasswordAction(formData);
            setFormMessage(result.message);

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
                <CardTitle className="text-xl">Forgot password</CardTitle>
                <CardDescription>Enter your email to receive a password reset link</CardDescription>
            </CardHeader>
            <CardContent className="px-10 py-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="New password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Confirm password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={isSubmitting}>
                                {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin"/>}
                                Log in
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

export default ResetPasswordForm;