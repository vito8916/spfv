'use server'

import { QuestionnaireFormData } from '@/lib/validations/questionnaire';
import { createClient } from '@/utils/supabase/server';
export async function saveQuestionnaireAnswers(data: QuestionnaireFormData) {
    try {
        const supabase = await createClient();

        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error('Not authenticated');

        // Convert camelCase keys to snake_case for database
        const dbData = {
            user_id: user.id,
            is_non_professional: data.isNonProfessional,
            is_investment_advisor: data.isInvestmentAdvisor,
            is_using_for_business: data.isUsingForBusiness,
            is_receiving_benefits: data.isReceivingBenefits,
            is_listed_as_financial_professional: data.isListedAsFinancialProfessional,
            is_registered_with_regulator: data.isRegisteredWithRegulator,
            is_engaged_in_financial_services: data.isEngagedInFinancialServices,
            is_trading_for_organization: data.isTradingForOrganization,
            is_contracted_for_private_use: data.isContractedForPrivateUse,
            is_using_others_capital: data.isUsingOthersCapital,
            is_performing_regulated_functions: data.isPerformingRegulatedFunctions,
            is_associated_with_firm: data.isAssociatedWithFirm,
            is_associated_with_public_company: data.isAssociatedWithPublicCompany,
            is_associated_with_broker_dealer: data.isAssociatedWithBrokerDealer,
        };

        // Check if user already has answers
        const { data: existingAnswers } = await supabase
            .from('opra_questionnaire_answers')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (existingAnswers) {
            // Update existing answers
            const { error: updateError } = await supabase
                .from('opra_questionnaire_answers')
                .update(dbData)
                .eq('user_id', user.id);

            if (updateError) throw updateError;
        } else {
            // Insert new answers
            const { error: insertError } = await supabase
                .from('opra_questionnaire_answers')
                .insert([dbData]);

            if (insertError) throw insertError;
        }

        return { success: true };
    } catch (error) {
        console.error('Error saving questionnaire answers:', error);
        return { success: false, error: 'Failed to save questionnaire answers' };
    }
} 