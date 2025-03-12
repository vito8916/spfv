import React from "react";
import AdditionalDataForm from "@/components/registration-flow/additional-data-form";
import { UserRound } from "lucide-react";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/app/actions/actions";

const AdditionalDataPage = async () => {
  const user = await getAuthUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userInfo = {
    fullName: user.user_metadata.full_name,
    email: user.email || "",
    avatar: user.user_metadata.avatar,
  };

  console.log(userInfo);
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <UserRound className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-muted-foreground">
          Please provide your contact information to complete your registration.
        </p>
      </div>
      <div className="w-full">
        <AdditionalDataForm user_info={userInfo} />
      </div>
    </div>
  );
};

export default AdditionalDataPage;
