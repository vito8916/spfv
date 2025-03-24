import Image from "next/image";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Target,
  Award,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/landing/cta-section";
export const metadata = {
  title: "About SP Fair Value | Investment Tools",
  description:
    "Learn about SP Fair Value, our mission, values, and the team behind our proprietary options trading tools.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="uppercase text-5xl font-extrabold tracking-tight mb-6 text-gray-800 dark:text-white">
              <span className="text-gray-800 dark:text-gray-100">About</span>
              <span className="text-primary"> SP</span>
              <span className="text-gray-600 dark:text-gray-300">
                {" "}
                Fair Value
              </span>
            </h1>
            <p className="lg:text-xl font-light text-gray-500 md:text-lg dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              We&apos;re revolutionizing options trading with advanced
              algorithms and a community-focused approach.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="uppercase mb-4 text-5xl tracking-tight font-extrabold text-gray-800 dark:text-white">
                Our Story
              </h2>
              <p className="font-light text-gray-500 md:text-lg dark:text-gray-400 mb-4">
                SP Fair Value was founded with a singular vision: to demystify
                options trading and provide traders with the tools they need to
                succeed in a complex market.
              </p>
              <p className="font-light text-gray-500 md:text-lg dark:text-gray-400 mb-4">
                Our founder, Sam, developed a proprietary algorithm that
                calculates the true fair value of options strikes, giving
                traders unprecedented insight into market opportunities.
              </p>
              <p className="font-light text-gray-500 md:text-lg dark:text-gray-400 mb-6">
                What began as a personal trading edge has evolved into a
                comprehensive platform that serves traders of all experience
                levels, from beginners to seasoned professionals.
              </p>
              <Link href="/contact">
                <Button size="xl" className="group flex items-center text-primary-foreground bg-primary hover:bg-primary/90">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="aspect-square relative rounded-2xl overflow-hidden ">
                <Image
                  src="/framehome-main-banner.png"
                  alt="SP Fair Value Founder"
                  fill
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -right-6 h-36 w-36 rounded-full bg-primary/20 z-0"></div>
              <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-primary/10 z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission and Values */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="uppercase text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              Our Mission & Values
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We&apos;re committed to empowering traders with accurate data,
              education, and community support.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="p-8 bg-background/60 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
              <p className="text-muted-foreground">
                To democratize access to professional-grade options trading
                tools and create a level playing field for individual investors.
              </p>
            </Card>

            <Card className="p-8 bg-background/60 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Award className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Core Values</h3>
              <p className="text-muted-foreground">
                Transparency, accuracy, and integrity guide everything we do. We
                believe in providing honest, reliable tools that deliver real
                results.
              </p>
            </Card>

            <Card className="p-8 bg-background/60 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Community</h3>
              <p className="text-muted-foreground">
                We foster a supportive community where traders can learn, share
                insights, and grow together in their investment journey.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="uppercase text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              What Makes Us Different
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our unique approach combines cutting-edge technology with
              practical trading insights.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            <div className="flex gap-6">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex-shrink-0 flex items-center justify-center">
                <BarChart3 className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">
                  Proprietary Algorithm
                </h3>
                <p className="text-muted-foreground">
                  Our Fair Value calculator provides precise strike valuations
                  that can&apos;t be found anywhere else, giving you a
                  significant edge in the market.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex-shrink-0 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Real-Time Analysis</h3>
                <p className="text-muted-foreground">
                  Our tools update continuously throughout the trading day,
                  ensuring you always have the most current data to inform your
                  decisions.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex-shrink-0 flex items-center justify-center">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Expert Community</h3>
                <p className="text-muted-foreground">
                  Connect with experienced traders who share insights,
                  strategies, and real-time market observations in our vibrant
                  community.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex-shrink-0 flex items-center justify-center">
                <Award className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Proven Results</h3>
                <p className="text-muted-foreground">
                  Our members report significant improvements in their trading
                  performance after incorporating our tools into their strategy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
              Join thousands of traders who have improved their performance with
              SP Fair Value tools.
            </p>
            <Link href="/sign-up">
              <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-medium">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section> */}

      {/* <section className="container py-24 mx-auto">
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-accent2/20 to-background rounded-3xl px-6 py-24 text-center shadow-xl sm:px-16">
          <h2 className="uppercase mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Ready to Transform Your{" "}
            <span className="text-primary">Trading</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 font-light text-gray-500 md:text-lg dark:text-gray-400">
          Join thousands of traders who have improved their performance with
          SP Fair Value tools.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/sign-up">
              <Button size="xl" className="text-lg font-medium">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section> */}
      <CTASection />
    </main>
  );
}
