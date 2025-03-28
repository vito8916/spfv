'use client'

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ShieldCheck, Loader2 } from "lucide-react";
import { getActiveTerms, acceptTerms, getUserTermsAcceptance } from '@/app/actions/terms';
import { toast } from 'sonner';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { updateRegistrationProgress } from '@/app/actions/registration';

interface TermData {
    id: string;
    type: string;
    content: string;
    version: string;
}

type FormSchema = z.infer<ReturnType<typeof createAgreementsSchema>>;

// Dynamic schema based on available terms
const createAgreementsSchema = (terms: TermData[]) => {
    const schemaFields: Record<string, z.ZodBoolean> = {};
    terms.forEach(term => {
        schemaFields[`${term.type}Accepted`] = z.boolean();
    });
    return z.object(schemaFields).refine(
        (data) => Object.values(data).every(value => value === true),
        {
            message: "You must accept all agreements to continue"
        }
    );
};

const AgreementsForm = () => {
    const router = useRouter();
    const [terms, setTerms] = useState<TermData[]>([]);
    const [isLoadingTerms, setIsLoadingTerms] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [schema, setSchema] = useState<z.ZodType<FormSchema>>();
    
    // Initialize form with empty schema
    const form = useForm<FormSchema>({
        resolver: schema ? zodResolver(schema) : undefined,
        mode: "onChange",
    });

    useEffect(() => {
        const loadTermsAndAcceptances = async () => {
            try {
                // Get all active terms
                const allTerms = await getActiveTerms('all') as TermData[];
                if (!allTerms?.length) {
                    throw new Error('No terms found');
                }
                setTerms(allTerms);

                // Create dynamic form schema
                const newSchema = createAgreementsSchema(allTerms);
                setSchema(newSchema);
                
                // Get user's existing acceptances
                const acceptances = await Promise.all(
                    allTerms.map(term => getUserTermsAcceptance(term.id))
                );

                // Set default values based on existing acceptances
                const defaultValues = Object.fromEntries(
                    allTerms.map((term, index) => [
                        `${term.type}Accepted`, !!acceptances[index]
                    ])
                );

                // Reset form with new values
                form.reset(defaultValues);
            } catch (error) {
                console.error('Error loading terms:', error);
                toast.error('Failed to load agreements. Please try again.');
            } finally {
                setIsLoadingTerms(false);
            }
        };

        loadTermsAndAcceptances();
    }, [form]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Check if all terms are accepted
        const formValues = form.getValues();
        const allAccepted = terms.every(term => formValues[`${term.type}Accepted`]);

        if (!allAccepted) {
            return;
        }

        try {
           
            // Get existing acceptances to avoid duplicates
            const existingAcceptances = await Promise.all(
                terms.map(term => getUserTermsAcceptance(term.id))
            );

            // Only accept terms that haven't been accepted yet
            const termsToAccept = terms.filter((term, index) => !existingAcceptances[index]);
            
            if (termsToAccept.length > 0) {
                await Promise.all(
                    termsToAccept.map(term => acceptTerms(term.id))
                );
            }

            // Update registration progress
            const progressResult = await updateRegistrationProgress('questionnaire');
            if (!progressResult.success) {
                throw new Error(progressResult.error);
            }

            // Show success message
            toast.success('Agreements accepted successfully');

            // Small delay to ensure the toast is seen
            //await new Promise(resolve => setTimeout(resolve, 1000));

            // Redirect to OPRA agreements
            router.push('/opra-agreements');
        } catch (error) {
            console.error('Error accepting terms:', error);
            toast.error('Failed to process agreements. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingTerms || !schema) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6">
                    {terms.map((term) => (
                        <Card key={term.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {term.type === 'privacy_policy' ? (
                                        <ShieldCheck className="h-5 w-5" />
                                    ) : (
                                        <FileText className="h-5 w-5" />
                                    )}
                                    {term.type.split('_').map(word => 
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(' ')}
                                </CardTitle>
                                <CardDescription>
                                    Version {term.version}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                    <div className="prose prose-sm dark:prose-invert">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {term.content}
                                        </ReactMarkdown>
                                    </div>
                                </ScrollArea>
                            </CardContent>
                            <CardFooter>
                                <FormField
                                    control={form.control}
                                    name={`${term.type}Accepted` as keyof FormSchema}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    I accept the {term.type.split('_').join(' ')}
                                                </FormLabel>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-end">
                    <Button 
                        type="submit" 
                        size="lg"
                        className="min-w-[200px]"
                        disabled={
                            isLoading || 
                            !terms.every(term => form.watch(`${term.type}Accepted` as keyof FormSchema))
                        }
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            terms.every(term => form.watch(`${term.type}Accepted` as keyof FormSchema))
                                ? 'Continue' 
                                : 'Accept All Agreements to Continue'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default AgreementsForm;
