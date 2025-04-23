'use server';

import { createClient } from "@/utils/supabase/server";

export async function getQuestionnaireAnswers(userId: string | undefined) {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('questionnaire')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        throw error;
    }

    return data;
}