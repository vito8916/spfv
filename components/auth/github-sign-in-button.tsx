"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Github from "@/components/github-icon";
import { Loader2 } from "lucide-react";
import { signInWithGitHub } from "@/app/actions/actions";
import { toast } from "sonner";

export function GitHubSignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithGitHub();

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.url) {
        // Manually redirect the user in the client
        console.log("Redirecting to:", result.url);
        window.location.href = result.url;
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      disabled={isLoading}
      onClick={handleClick}
      size="icon"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Github className="h-4 w-4" />
      )}
      
    </Button>
  );
}
