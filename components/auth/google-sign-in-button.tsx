import { Button } from "@/components/ui/button";
import Google from "@/components/google-icon";
import { useState } from "react";
import { signInWithGoogleAction } from "@/app/actions/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithGoogleAction();

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
    <Button variant="outline" size="icon" onClick={handleClick} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Google className="h-4 w-4" />
      )}
      
    </Button>
  );
}
