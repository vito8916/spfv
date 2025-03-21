import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | SP Fair Value",
  description:
    "Privacy Policy for SP Fair Value - How we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="uppercase text-5xl font-extrabold tracking-tight mb-6 text-gray-800 dark:text-white">
              <span className="text-gray-800 dark:text-gray-100">Privacy</span>
              <span className="text-primary"> Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              How we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-6">
                The following privacy policy (“Policy”) governs the information
                practices used on SPFairValue.com (the “Website”) for the
                services provided to you as set forth in the Terms of Use for
                the Website. Throughout this Policy, we refer to information
                that personally identifies you as &quot;personal
                information&quot;. All capitalized terms not otherwise defined
                in this Policy shall be as set forth in the Terms of Service for
                the website.
              </p>

              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                Personal Information
              </h2>
              <p className="text-muted-foreground mb-4">
                When visiting, personally identifiable information about you is
                not collected unless you specifically provide it to us. For
                example, when you register with the Website, we require certain
                personal information, such as your name, address and email
                address. We may also obtain certain billing information, such as
                bank, credit or debit card information for the sole purpose of
                facilitating payment for the services provided through the
                Website.
              </p>

              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                How Your Information Is Used
              </h2>
              <p className="text-muted-foreground mb-4">
                We may share information we have collected about you in certain
                situations. Your information may be disclosed as follows:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>
                  <strong>By law or to protect rights.</strong> <br /> If we
                  believe the release of information about you is necessary to
                  respond to legal process, to investigate or remedy potential
                  violations of our policies, or to protect the rights,
                  property, and safety of others, we may share your information
                  as permitted or required by any applicable law, rule, or
                  regulation. This includes exchanging information with other
                  entities for fraud protection and credit risk reduction.
                </li>
                <li>
                  <strong>Third-Party Service Providers</strong> <br /> We may
                  share your information with third parties that perform
                  services for us or on our behalf, including payment
                  processing, data analysis, email delivery, hosting services,
                  customer service, and marketing assistance.
                </li>
                <li>
                  <strong>Marketing Communications</strong> <br /> With your
                  consent, or with an opportunity for you to withdraw consent,
                  we may share your information with third parties for marketing
                  purposes, as permitted by law.
                </li>
                <li>
                  <strong>Third-Party Advertisers</strong> <br /> We may use
                  third-party advertising companies to serve ads when you visit
                  the Website. These companies may use information about your
                  visits to the Website and other websites that are contained in
                  web cookies in order to provide advertisements about goods and
                  services of interest to you.
                </li>
                <li>
                  <strong>Affiliates</strong> <br /> We may share your
                  information with our affiliates, in which case we will require
                  those affiliates to honor this Policy. Affiliates include our
                  parent company and any subsidiaries, joint venture partners or
                  other companies that we control or that are under common
                  control with us.
                </li>
                <li>
                  <strong>Business Partners</strong> <br /> We may share your
                  information with our business partners to offer you certain
                  products, services or promotions.
                </li>
              </ul>

              <p className="text-muted-foreground mb-4">
                <strong>Tracking Technologies:</strong>
              </p>

              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>
                  <strong>Cookies and Web Beacons</strong> <br /> We may use
                  cookies, web beacons, tracking pixels, and other tracking
                  technologies on the Website to help customize the Website and
                  improve your experience. When you access the Website, your
                  personal information is not collected through the use of
                  tracking technology. Most browsers are set to accept cookies
                  by default. You can remove or reject cookies, but be aware
                  that such action could affect the availability and
                  functionality of the Website. You may not decline web beacons.
                  However, they can be rendered ineffective by declining all
                  cookies or by modifying your web browser’s settings to notify
                  you each time a cookie is tendered, permitting you to accept
                  or decline cookies on an individual basis.
                </li>
                <li>
                  <strong>Internet-Based Advertising</strong> <br />{" "}
                  Additionally, we may use third-party software to serve ads on
                  the Website, implement email marketing campaigns, and manage
                  other interactive marketing initiatives. This third-party
                  software may use cookies or similar tracking technology to
                  help manage and optimize your online experience with us.
                </li>
                <li>
                  <strong>Website Analytics</strong> <br /> We may also partner
                  with selected third-party vendors, such as Adobe Analytics,
                  Clicktale, Clicky, Cloudfare, Crazy Egg, Flurry Analytics,
                  Google Analytics, Heap Analytics, Inspectlet, Kissmetrics,
                  Mixpanel, Piwik, and others, to allow tracking technologies
                  and remarketing services on the Website through the use of
                  first party cookies and third-party cookies, to, among other
                  things, analyze and track users’ use of the Website, determine
                  the popularity of certain content, and better understand
                  online activity. By accessing the Website, you consent to the
                  collection and use of your information by these third-party
                  vendors. You are encouraged to review their privacy policy and
                  contact them directly for responses to your questions. We do
                  not transfer personal information to these third-party
                  vendors. You should be aware that getting a new computer,
                  installing a new browser, upgrading an existing browser, or
                  erasing or otherwise altering your browser’s cookies files may
                  also clear certain optout cookies, plug-ins, or settings that
                  may affect the function, and your use of, the Website.
                </li>
                <li>
                  <strong>Third-Party Websites</strong> <br /> The Website may
                  contain links to third-party websites and applications of
                  interest, including advertisements and external services, that
                  are not affiliated with us.{" "}
                  <strong>
                    Once you have used these links to leave the Website, any
                    information you provide to these third parties is not
                    covered by this Policy, and we cannot guarantee the safety
                    and privacy of your information as a result.
                  </strong>{" "}
                  Before visiting and providing any information to any
                  third-party websites, you should inform yourself of the
                  privacy policies and practices (if any) of the third party
                  responsible for that website, and should take those steps
                  necessary to, in your discretion, protect the privacy of your
                  information. We are not responsible for the content or privacy
                  and security practices and policies of any third parties,
                  including other sites, services or applications that may be
                  linked to or from the Website.
                </li>
              </ul>

              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                Options Regarding Your Information
              </h2>
              <p className="text-muted-foreground mb-6">
                You may at any time review or change the information in your
                account or terminate your account by:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>
                  Noting your preferences at the time you register your account
                  with us
                </li>
                <li>
                  Logging into your account settings and updating your
                  preferences.
                </li>
                <li>
                  Contacting us using the contact information provided below
                </li>
                <li>
                  If you no longer wish to receive correspondence, emails, or
                  other communications from third parties, you are responsible
                  for contacting the third party directly.
                </li>
              </ul>

              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                Policy Regarding Children
              </h2>
              <p className="text-muted-foreground mb-4">
                The Website is not for use by minors. We do not knowingly
                solicit information from or market to children under the age of
                17. If you become aware of any data we have collected from
                children under age 17, please contact us using the contact
                information provided below.
              </p>

              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                Security
              </h2>
              <p className="text-muted-foreground mb-6">
                Personal information is stored on the Website but may also be
                kept in a database external to the Internet. We work to protect
                your personal information from loss, misuse or unauthorized
                alteration by using industry-recognized security safeguards,
                such as firewalls, to protect the confidentiality and security
                of your personal information from loss, misuse or unauthorized
                alteration. Whenever we ask for sensitive information, such as
                your Billing Information, it is encrypted it as it is
                transmitted to us.
              </p>

              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                Modifications to Our Policy
              </h2>
              <p className="text-muted-foreground mb-6">
                We reserve the right to make changes to this Policy at any time
                and for any reason. We will alert you about any changes by
                updating the “Last updated” date of this Policy. You are
                encouraged to periodically review this Policy to stay informed
                of updates. You will be deemed to have been made aware of, will
                be subject to, and will be deemed to have accepted the changes
                in any revised Policy by your continued use of the Website after
                the date such revised Policy is posted.
              </p>

              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
              Customers that reside in the state of California
              </h2>
              <p className="text-muted-foreground mb-6">
              CCPAA covers the following critical areas as outlined in the act’s opening:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>
                The right of Californians to know what personal information is being collected about them.
                </li>
                <li>
                The right of Californians to know whether their personal information is sold or disclosed and to whom.
                </li>
                <li>
                The right of Californians to say no to the sale of personal information.
                </li>
                <li>
                The right of Californians to access their personal information.                
                </li>
                <li>
                The right of Californians to equal service and price, even if they exercise their privacy rights.
                </li>
              </ul>


              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                Contact Us
              </h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions about this Privacy Policy, you can
                contact us:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground">
                <li>
                  By email:{" "}
                  <a
                    href="mailto:webmaster@spfairvalue.com"
                    className="text-primary hover:underline"
                  >
                    webmaster@spfairvalue.com
                  </a>
                </li>
                <li>
                  By visiting our contact page:{" "}
                  <Link
                    href="/contact"
                    className="text-primary hover:underline"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mt-16 flex justify-center">
              <Link href="/sign-up">
                <Button className="group flex items-center text-primary-foreground bg-primary hover:bg-primary/90 py-6 px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
