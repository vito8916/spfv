import * as z from "zod";

export const questionnaireSchema = z.object({
    isNonProfessional: z.boolean().default(true),
    // Professional questions - all default to false
    isInvestmentAdvisor: z.boolean().default(false),
    isUsingForBusiness: z.boolean().default(false),
    isReceivingBenefits: z.boolean().default(false),
    isListedAsFinancialProfessional: z.boolean().default(false),
    isRegisteredWithRegulator: z.boolean().default(false),
    isEngagedInFinancialServices: z.boolean().default(false),
    isTradingForOrganization: z.boolean().default(false),
    isContractedForPrivateUse: z.boolean().default(false),
    isUsingOthersCapital: z.boolean().default(false),
    isPerformingRegulatedFunctions: z.boolean().default(false),
    isAssociatedWithFirm: z.boolean().default(false),
    isAssociatedWithPublicCompany: z.boolean().default(false),
    isAssociatedWithBrokerDealer: z.boolean().default(false),
}).refine((data) => {
    // If isNonProfessional is false, all other fields must be defined
    if (!data.isNonProfessional) {
        return data.isInvestmentAdvisor !== undefined &&
            data.isUsingForBusiness !== undefined &&
            data.isReceivingBenefits !== undefined &&
            data.isListedAsFinancialProfessional !== undefined &&
            data.isRegisteredWithRegulator !== undefined &&
            data.isEngagedInFinancialServices !== undefined &&
            data.isTradingForOrganization !== undefined &&
            data.isContractedForPrivateUse !== undefined &&
            data.isUsingOthersCapital !== undefined &&
            data.isPerformingRegulatedFunctions !== undefined &&
            data.isAssociatedWithFirm !== undefined &&
            data.isAssociatedWithPublicCompany !== undefined &&
            data.isAssociatedWithBrokerDealer !== undefined;
    }
    return true;
}, {
    message: "Please answer all questions"
});

export type QuestionnaireFormData = z.infer<typeof questionnaireSchema>; 