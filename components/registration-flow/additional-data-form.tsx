'use client'

import React, { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { userProfileSchema, type UserProfileFormData } from "@/lib/validations/user-profile";
import { US_STATES } from "@/lib/constants/location";
import { getCurrentUser, updateUser } from '@/app/actions/users';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import AdditionalDataSkeleton from '../skeletons/additional-data-skeleton';
import { Loader2 } from 'lucide-react';

interface UserInfo {
    fullName: string;
    email: string;
    avatar: string;
}

interface AdditionalDataFormProps {
    user_info: UserInfo;
}

const AdditionalDataForm = ({ user_info }: AdditionalDataFormProps) => {
    const router = useRouter(); 
    const [isLoading, setIsLoading] = useState(true);

    // Initialize form with react-hook-form and zod resolver
    const form = useForm<UserProfileFormData>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            fullName: user_info.fullName || "",
            email: user_info.email || "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            zipCode: "",
            phone: "",
        },
    });

    const { isSubmitting } = form.formState;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const user = await getCurrentUser();
                
                if (!user) {
                    toast.error("Failed to fetch user data");
                    return;
                }

                form.reset({
                    fullName: user_info.fullName || "",
                    email: user_info.email || "",
                    address1: user.billing_address?.street || "",
                    address2: "",  // Since address2 is not in the BillingAddress type
                    city: user.billing_address?.city || "",
                    state: user.billing_address?.state || "",
                    zipCode: user.billing_address?.postalCode || "",
                    phone: user.phone || "",
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Failed to load user data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [form, user_info]);

    const onSubmit = async (data: UserProfileFormData) => {
        try {
            const response = await updateUser({
                full_name: data.fullName,
                billing_address: {
                    street: data.address1,
                    city: data.city,
                    state: data.state,
                    postalCode: data.zipCode,
                    country: "USA",
                },
                phone: data.phone,
            });

            if (!response.success) {
                throw new Error(response.error);
            }

            toast.success("Profile updated successfully");
            router.push("/agreements");
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update profile");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            {isLoading ? (
                <AdditionalDataSkeleton />
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* User Info Fields (Read-only) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            readOnly 
                                            className="bg-muted"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            readOnly 
                                            className="bg-muted"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Address Fields */}
                    <FormField
                        control={form.control}
                        name="address1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="123 Main St" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address2"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Apartment, suite, etc. (optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Apt 4B" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* City, State, ZIP */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="New York" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder="Select state" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {US_STATES.map((state) => (
                                                <SelectItem key={state.value} value={state.value}>
                                                    {state.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ZIP Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="12345" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Phone Number */}
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="(123) 456-7890" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Continue Button */}
                    <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                        aria-label="Save profile information and continue"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save and Continue'
                        )}
                    </Button>
                    </form>
                </Form>
            )}
        </div>
    );
};

export default AdditionalDataForm;