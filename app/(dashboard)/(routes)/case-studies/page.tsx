import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import cs1 from "@/public/assets/images/case-studies/cs1.jpg";
import cs2 from "@/public/assets/images/case-studies/cs2.jpg";
import cs3 from "@/public/assets/images/case-studies/cs3.jpg";
import cs4 from "@/public/assets/images/case-studies/cs4.jpg";

export default function CaseStudiesPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-12 md:mb-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
          Real-World Success Stories
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Discover how traders and investors are using SP Fair Value to gain an
          edge in the markets with these real-world case studies.
        </p>
      </div>

      <div className="grid gap-12">
        {/* Case Study 1 */}
        <div className="rounded-2xl border border-border/50 overflow-hidden bg-card/50">
          <div className="grid md:grid-cols-2 items-start gap-8 p-8">
            <div className="flex flex-col justify-start space-y-6">
              <div>
                <Badge variant="outline" className="px-3 py-1 rounded-full mb-4">
                  Options Strategy
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
                  META 595 3/21 Puts
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  META puts were priced $1.40 over fair value, an almost 25%
                  discrepancy. Not soon after this pricing difference was
                  discovered, META stock dumped nearly $6 from the highs.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3 text-sm">Results:</h4>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-background/60 border">
                      SP Fair Value: $7.17
                    </span>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-background/60 border">
                      Market Price: $5.76
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full h-[350px] rounded-xl overflow-hidden bg-background/50">
              <Image 
                src={cs1} 
                alt="Case Study 1 Chart"
                className="object-cover p-2"
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>

        {/* Case Study 2 */}
        <div className="rounded-2xl border border-border/50 overflow-hidden bg-card/50">
          <div className="grid md:grid-cols-2 items-start gap-8 p-8">
            <div className="relative w-full h-[450px] rounded-xl overflow-hidden bg-background/50 order-last md:order-first">
              <Image 
                src={cs2} 
                alt="Case Study 2 Chart"
                className="object-contain p-2"
                width={400}
                height={600}
              />
            </div>
            <div className="flex flex-col justify-start space-y-6">
              <div>
                <Badge variant="outline" className="px-3 py-1 rounded-full mb-4">
                  Market Analysis
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
                  SPX 3/20 Options
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Similar to our other example, put premiums far outpace call
                  premiums at equal points out in the option series, forecasting a
                  move before the premiums come back in line to a more normalized
                  structure
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3 text-sm">Results:</h4>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-background/60 border">
                      SPX 75 strikes up (call): $1.65
                    </span>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-background/60 border">
                      SPX 75 strikes down (put): $4.15
                    </span>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-background/60 border">
                      Ratio: -2.52x
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Case Study 3 */}
        <div className="rounded-2xl border border-border/50 overflow-hidden bg-card/50">
          <div className="grid md:grid-cols-2 items-start gap-8 p-8">
            <div className="flex flex-col justify-start space-y-6">
              <div>
                <Badge variant="outline" className="px-3 py-1 rounded-full mb-4">
                  Trading Strategy
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
                  SPX 3/14 Options
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Call / put ratios can offer insight about expected moves and how
                  market makers and dealing are pricing risk. Slight imbalances to
                  the put side are not uncommon, but extreme imbalances to either
                  side can signal potential moves
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3 text-sm">Results:</h4>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-background/60 border">
                      SPX 75 strikes up (call): $1.50
                    </span>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-background/60 border">
                      SPX 75 strikes down (put): $5.10
                    </span>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-background/60 border">
                      Ratio: -5.5x
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full h-[450px] rounded-xl overflow-hidden bg-background/50">
              <Image 
                src={cs3} 
                alt="Case Study 3 Chart"
                className="object-contain p-2"
                width={400}
                height={600}
              />
            </div>
          </div>
        </div>

        {/* Case Study 4 */}
        <div className="rounded-2xl border border-border/50 overflow-hidden bg-card/50">
          <div className="grid md:grid-cols-2 items-start gap-8 p-8">
            <div className="relative w-full h-[450px] rounded-xl overflow-hidden bg-background/50 order-last md:order-first">
              <Image 
                src={cs4} 
                alt="Case Study 4 Chart"
                className="object-cover p-2"
                width={400}
                height={600}
              />
            </div>
            <div className="flex flex-col justify-start space-y-6">
              <div>
                <Badge variant="outline" className="px-3 py-1 rounded-full mb-4">
                  Market Analysis
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
                  TSLA 345 12/6 Calls
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Here we see 1 week out TSLA calls priced above the fair value.
                  We only represent one strike here, but typically an entire
                  series will show the premium repricing relative to fair value
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3 text-sm">Results:</h4>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-background/60 border">
                      SP Fair Value: $7.25
                    </span>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-background/60 border">
                      Market Price: $6.15
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
