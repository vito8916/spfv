'use client'

import React from 'react';
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

// This would come from your database/auth context
const mockUserData = {
    fullName: "John Doe",
    email: "john.doe@example.com"
};

const AdditionalDataForm = () => {
    // Initialize form with react-hook-form and zod resolver
    const form = useForm<UserProfileFormData>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            fullName: mockUserData.fullName, // This would come from your database
            email: mockUserData.email, // This would come from your database
            address1: "",
            address2: "",
            city: "",
            state: "",
            zipCode: "",
            phone: "",
        },
    });

    const onSubmit = async (data: UserProfileFormData) => {
        try {
            console.log("Form submitted:", data);
            // TODO: Handle form submission
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">

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

                    <Button type="submit" className="w-full">
                        Save and Continue
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default AdditionalDataForm;