import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/components/dashboard/user-info";
import Link from "next/link";
import { LogOut, Settings } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";

interface User {
  name: string;
  email: string;
  avatar: string;
}

export function UserMenuContent({ user }: { user: User }) {
  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} showEmail={true} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link className="block w-full" href={"/settings"} prefetch>
            <Settings className="mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={signOutAction}>
        <LogOut className="mr-2" />
        Log out
      </DropdownMenuItem>
    </>
  );
}
