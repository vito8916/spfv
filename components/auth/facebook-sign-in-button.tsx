import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signInWithFacebookAction } from "@/app/actions/auth";
import { toast } from "sonner";
import Facebook from "@/components/facebook-icon";
import { Loader2 } from "lucide-react";
export default function FacebookSignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithFacebookAction();

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
        <Facebook className="h-4 w-4" />
      )}
      
    </Button>
  );
}
