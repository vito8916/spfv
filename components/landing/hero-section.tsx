import Image from "next/image";
import { CTAButton } from "@/components/landing/cta-button";

export async function HeroSection() {
  return (
      <section className="relative bg-background overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 z-0" />
        <div className="absolute w-full lg:w-[71%] aspect-[0.618/1] opacity-20 top-0 lg:-bottom-[36px] right-[14%] -z-10 rotate-[-157deg]">
          <div className="absolute w-[40%] aspect-[0.325/1] bg-[#a5a2ff] rounded-full blur-[200px] left-[138px] top-[31px] rotate-12" />
          <div className="absolute w-[40%] aspect-[0.572/1] bg-[#c79d29] rounded-full blur-[200px] left-[222px] top-[208px]" />
          <div className="absolute w-[40%] aspect-[0.571/1] bg-[#ff9c4b] rounded-full blur-[200px] left-[436px] top-[340px]" />
        </div>

        {/* Main content */}
        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="uppercase mb-6 text-6xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
              Transform Your Trading with{" "}
              <span className="text-primary">SP Fair</span>{" "}
              <span className="text-gray-800 dark:text-white">Value</span>
            </h1>
            <p className="mb-8 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400 max-w-2xl mx-auto">
              A model that generates fair value prices for Options, and delivers
              the opportunity to increase profits and improve trading performance
              measurably called SP Fair Value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <CTAButton title="Get Started" />
              <button className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-primary/30 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700">
                Learn More
              </button>
            </div>

            {/* App Preview */}
            <div className="relative mx-auto max-w-5xl">
              {/* Stats cards */}
              <div className="absolute -left-12 top-1/4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 hidden lg:block">
                <p className="text-sm text-gray-500 dark:text-gray-400">Average Return Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24.6%</p>
                <div className="flex items-center mt-1">
                  <span className="text-green-500 text-sm">↑ 8.3% MTD</span>
                </div>
              </div>
              <div className="absolute -right-8 bottom-1/4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 hidden lg:block">
                <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">92%</span>
                </div>
              </div>
              {/* Main image */}
              <Image
                  priority
                  src="/assets/images/spfvtool.webp"
                  alt="SP Fair Value Dashboard"
                  width={1000}
                  height={600}
                  className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>
  );
}
