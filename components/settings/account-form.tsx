
import { LoaderCircle, UserCog, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { User } from "@supabase/supabase-js";


export function AccountForm( { user }: { user: User }) {

  if (!user) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoaderCircle className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
      <div className="flex items-center gap-2">
        <UserCog className="h-5 w-5" />
        <CardTitle>Account Information</CardTitle>
      </div>
        <CardDescription>Your account details and information.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarImage src={user.user_metadata.avatar_url} alt={user.email} />
            <AvatarFallback className="text-2xl">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h2 className="text-2xl font-bold">{user.user_metadata.full_name}</h2>
              {/* <Badge className="bg-primary text-primary-foreground ml-0 md:ml-2">
                Pro Account {user.user_metadata.pro_account ? "Active" : "Inactive"}
              </Badge> */}
            </div>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">
              Member since {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <div className="pt-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/profile">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
