import * as z from "zod";

export const agreementsSchema = z.object({
    termsAndConditions: z.boolean().refine(value => value === true, {
        message: "You must accept the Terms and Conditions"
    }),
    privacyPolicy: z.boolean().refine(value => value === true, {
        message: "You must accept the Privacy Policy"
    })
});

export type AgreementsFormData = z.infer<typeof agreementsSchema>; 