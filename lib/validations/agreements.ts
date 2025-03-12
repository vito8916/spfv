import * as z from "zod";

export const agreementsSchema = z.object({
    termsAccepted: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions",
    }),
    privacyAccepted: z.boolean().refine((val) => val === true, {
        message: "You must accept the privacy policy",
    }),
});

export type AgreementsFormData = z.infer<typeof agreementsSchema>; 