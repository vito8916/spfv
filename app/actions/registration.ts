'use server'

import { createClient } from '@/utils/supabase/server';

export type RegistrationStep = 
    | 'account_confirmation'
    | 'additional_data'
    | 'agreements'
    | 'questionnaire'
    | 'opra_agreements'
    | 'registration_completed';

/* const STEP_ORDER: RegistrationStep[] = [
    'account_confirmation',
    'additional_data',
    'agreements',
    'questionnaire',
    'registration_completed'
]; */

export async function getCurrentRegistrationStep() {
    try {
        const supabase = await createClient();

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('registration_progress')
            .select('current_step, completed_steps')
            .eq('id', user.id)
            .single();

        if (error) throw error;
        if (!data) throw new Error('Registration progress not found');

        return {
            success: true,
            currentStep: data.current_step,
            completedSteps: data.completed_steps
        };
    } catch (error) {
        console.error('Error getting registration progress:', error);
        return { success: false, error: 'Failed to get registration progress' };
    }
}

export async function updateRegistrationProgress(step: RegistrationStep) {
    try {
        const supabase = await createClient();

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error('Not authenticated');

        const { data: currentProgress, error: progressError } = await supabase
            .from('registration_progress')
            .select('current_step, completed_steps')
            .eq('id', user.id)
            .single();

        if (progressError) throw progressError;
        if (!currentProgress) throw new Error('Registration progress not found');

        //update the current step to the step passed in
        const { error: updateError } = await supabase
            .from('registration_progress')
            .update({ current_step: step, completed_steps: [...currentProgress.completed_steps, step] })
            .eq('id', user.id);

        if (updateError) throw updateError;

        if(step === 'registration_completed') {
            const { error: updateCompletedError } = await supabase
                .from('registration_progress')
                .update({ completed_at: new Date().toISOString() })
                .eq('id', user.id);
                
            if (updateCompletedError) throw updateCompletedError;
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating registration progress:', error);
        return { success: false, error: 'Failed to update registration progress' };
    }
}

