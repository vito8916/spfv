"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { LoaderCircle, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { deleteAccountAction } from "@/app/actions/settings";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteAccount() {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        const response = await deleteAccountAction();
        if (response.success) {
            toast.success("Account deleted successfully");
            router.push("/");
        } else {
            toast.error(response.error);
        }
        setIsDeleting(false);
    }

  return (
    
    <Card className="border-destructive">
    <CardHeader>
      <div className="flex items-center gap-2">
        <Trash2 className="h-5 w-5 text-destructive" />
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
      </div>
      <CardDescription>
        Irreversible and destructive actions for your account
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Once you delete your account, there is no going back. This action is permanent and will remove all your data.
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isDeleting}>
            {isDeleting ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Account"
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CardContent>
  </Card>
  );
}