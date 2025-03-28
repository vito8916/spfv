"use client";

import Logo from "@/components/logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions/auth";

const NavbarRegistrationFlow = () => {
  const pathname = usePathname();

  // Define the order of registration steps
  const registrationSteps = [
    "/account-confirmation",
    "/additional-data",
    "/agreements",
    "/questionnaire",
    "/registration-completed",
  ];

  // Get the current step index
  const currentStepIndex = registrationSteps.indexOf(pathname);
  console.log("currentStepIndex", currentStepIndex);

  const navItems = [
    {
      label: "Account Confirmation",
      href: "/account-confirmation",
    },
    {
      label: "Additional Data",
      href: "/additional-data",
    },
    {
      label: "Agreements",
      href: "/agreements",
    },
    {
      label: "Questionnaire",
      href: "/questionnaire",
    },
    {
      label: "Registration Completed",
      href: "/registration-completed",
    },
  ];  

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        {/* Navigation Steps */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item, index) => {
            const isDisabled = index < currentStepIndex || index > currentStepIndex ;
            return (
              <div key={item.href} className="flex items-center">
                {index > 0 && (
                  <div className="h-px w-8 bg-muted-foreground/20 mx-2" />
                )}
                <Link
                  href={isDisabled ? "#" : item.href}
                  onClick={(e) => {
                    if (isDisabled) {
                      e.preventDefault();
                      console.log("isDisabled", isDisabled);
                    }
                  }}
                  className={cn(
                    "relative text-sm transition-colors hover:text-foreground/80",
                    pathname === item.href
                      ? "text-foreground font-semibold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                      : "text-foreground/60",
                    isDisabled && "pointer-events-none opacity-50"
                  )}
                >
                  {item.label}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Logout Button */}
        <Button variant="ghost" size="sm" className="gap-2" onClick={() => {
          signOutAction();
        }}>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </nav>
  );
};

export default NavbarRegistrationFlow;
