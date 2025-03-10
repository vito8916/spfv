import * as z from "zod";

export const userProfileSchema = z.object({
    fullName: z.string(),
    email: z.string().email(),
    address1: z.string().min(5, "Street address is required"),
    address2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().length(2, "Please select a state"),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format (e.g., 12345 or 12345-6789)"),
    phone: z.string().regex(/^\+?1?\s*\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/, "Invalid US phone number"),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>; 