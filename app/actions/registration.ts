'use server'

import { createClient } from '@/utils/supabase/server';

export type RegistrationStep = 
    | 'account_confirmation'
    | 'additional_data'
    | 'agreements'
    | 'questionnaire'
    | 'opra_agreements'
    | 'completed';

const STEP_ORDER: RegistrationStep[] = [
    'account_confirmation',
    'additional_data',
    'agreements',
    'questionnaire',
    'opra_agreements',
    'completed'
];

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

        // Get current progress
        const { data: currentProgress, error: progressError } = await supabase
            .from('registration_progress')
            .select('current_step, completed_steps')
            .eq('id', user.id)
            .single();

        if (progressError) throw progressError;
        if (!currentProgress) throw new Error('Registration progress not found');

        // Update completed steps
        const completedSteps = Array.from(new Set([
            ...currentProgress.completed_steps,
            currentProgress.current_step
        ]));

        // Determine next step
        const currentStepIndex = STEP_ORDER.indexOf(step);
        const nextStep = STEP_ORDER[currentStepIndex + 1] || 'completed';

        // Update progress
        const { error: updateError } = await supabase
            .from('registration_progress')
            .update({
                current_step: nextStep,
                completed_steps: completedSteps,
                ...(nextStep === 'completed' ? { completed_at: new Date().toISOString() } : {})
            })
            .eq('id', user.id);

        if (updateError) throw updateError;

        return { success: true, nextStep };
    } catch (error) {
        console.error('Error updating registration progress:', error);
        return { success: false, error: 'Failed to update registration progress' };
    }
}

export async function isStepAccessible(step: RegistrationStep) {
    try {
        const { success, currentStep, completedSteps, error } = await getCurrentRegistrationStep();
        if (!success) throw new Error(error);

        const stepIndex = STEP_ORDER.indexOf(step);
        const currentStepIndex = STEP_ORDER.indexOf(currentStep);

        // Allow access if:
        // 1. Step is completed
        // 2. Step is current
        // 3. Step is immediately next
        return {
            success: true,
            isAccessible: completedSteps.includes(step) ||
                         step === currentStep ||
                         stepIndex === currentStepIndex + 1
        };
    } catch (error) {
        console.error('Error checking step accessibility:', error);
        return { success: false, error: 'Failed to check step accessibility' };
    }
} 