import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/logo";
import { getAuthUser } from "@/app/actions/auth";
import Image from "next/image";
import { CTAButton } from "@/components/landing/cta-button";
export async function HeroSection() {
  const user = await getAuthUser();

  return (
    <div>
      <div className="relative z-10">
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

        <section className="bg-white dark:bg-gray-900">
          <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div className="mr-auto place-self-center lg:col-span-7">
              <h1 className="uppercase max-w-2xl mb-4 text-6xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
                <span className="text-gray-800">What</span>
                <span className="text-primary"> Sam</span>
                <span className="text-gray-600"> Developed</span>
              </h1>
              <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                A model that generates fair value prices for Options, and
                delivers the opportunity to increase profits and improve trading
                performance measurably called SP Fair Value.
              </p>
              <div className="flex items-center gap-4">
                <CTAButton title="Get Started" />
              </div>
            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
              <Image
                src="/framehome-main-banner.png"
                alt="mockup"
                width={500}
                height={500}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
