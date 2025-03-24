import { Check } from "lucide-react";
import Image from "next/image";

const benefits = [
  {
    title: "Advanced Trading Tools",
    description:
      "Access powerful SPFV tools and algorithms for precise fair value calculations",
  },
  {
    title: "Real-time Analysis",
    description:
      "Get instant market insights and fair value calculations to make informed decisions",
  },
  {
    title: "Community Support",
    description:
      "Join a thriving community of traders and get support when you need it",
  },
  {
    title: "Professional Platform",
    description:
      "Built with modern technology to ensure reliability and performance",
  },
];

export function BenefitsSection() {
  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="uppercase text-6xl tracking-tight font-extrabold text-gray-800 dark:text-white mb-12 text-center">
              Why Use Sp Fair Value?
            </h2>
            <div className="space-y-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4 items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{benefit.title}</h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-10 bg-white dark:bg-gray-900 relative z-10 overflow-hidden">
        <div className="absolute w-full lg:w-[71%] aspect-[0.618/1] opacity-20 top-[100px] lg:-bottom-[36px] right-[14%] -z-10 rotate-[360deg]">
          <div className="absolute w-[40%] aspect-[0.325/1] bg-[#e8e7ff] rounded-full blur-[200px]  left-[138px] top-[31px] rotate-12"></div>
          <div className="absolute w-[40%] aspect-[0.572/1] bg-[#c79d29] rounded-full blur-[200px] left-[222px] top-[208px]"></div>
          <div className="absolute w-[40%] aspect-[0.571/1] bg-[#ff9c4b] rounded-full blur-[200px] left-[436px] top-[340px]"></div>
        </div>
        <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
          <Image
            className="w-full dark:hidden"
            src="/spfv-tool-illustration.png"
            alt="dashboard image"
            width={500}
            height={500}
          />
          <div className="mt-4 md:mt-0">
            <h2 className="uppercase mb-4 text-5xl tracking-tight font-extrabold text-gray-800 dark:text-white">
              The Model That Increases Your Profits
            </h2>
            <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
              SPFV is a model that generates fair value prices for Options, and
              delivers the opportunity to increase profits and improve trading
              performance measurably.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
