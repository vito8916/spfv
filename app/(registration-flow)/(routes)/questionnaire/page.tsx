import { ClipboardCheck } from "lucide-react";
import QuestionnaireForm from "@/components/registration-flow/questionnaire-form";

const QuestionnairePage = () => {
    return (
        <div className="container max-w-4xl mx-auto p-6">
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <ClipboardCheck className="h-6 w-6 text-primary" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold mb-2">Professional Status Questionnaire</h1>
                <p className="text-muted-foreground">
                    Please answer the following questions to determine your professional status
                </p>
            </div>
            <QuestionnaireForm />
        </div>
    );
};

export default QuestionnairePage;
