import Link from "next/link";
import { Button } from "../ui/button";
import Logo from "../logo";
import { getAuthUser } from "@/app/actions/auth";

export default async function NavbarLanding() {

    const user = await getAuthUser();

  return (
    <header className="container mx-auto px-4 py-6">
    <nav className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Logo />
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        ) : (
          <>
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  </header>
  );
}

