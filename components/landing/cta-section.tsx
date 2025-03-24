import { CTAButton } from "@/components/landing/cta-button";

export function CTASection() {
  return (
    <section className="py-20 bg-background relative overflow-hidden z-10">
      <div className="absolute w-full lg:w-[71%] aspect-[0.618/1] opacity-20 top-0 lg:-bottom-[36px] right-[14%] -z-10 rotate-[-157deg]">
        <div className="absolute w-[40%] aspect-[0.325/1] bg-[#a5a2ff] rounded-full blur-[200px]  left-[138px] top-[31px] rotate-12"></div>
        <div className="absolute w-[40%] aspect-[0.572/1] bg-[#c79d29] rounded-full blur-[200px] left-[222px] top-[208px]"></div>
        <div className="absolute w-[40%] aspect-[0.571/1] bg-[#ff9c4b] rounded-full blur-[200px] left-[436px] top-[340px]"></div>
      </div>
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="uppercase text-6xl tracking-tight font-extrabold text-gray-800 dark:text-white mb-6">
            Ready to Start Your Trading Journey?
          </h2>
          <p className="font-light text-gray-500 dark:text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of traders who trust our platform for accurate fair
            value pricing and advanced trading tools.
          </p>
          <CTAButton title="Get Started" />
        </div>
      </div>
    </section>
  );
}
