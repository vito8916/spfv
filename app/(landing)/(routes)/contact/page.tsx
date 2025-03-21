import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Contact SP Fair Value | Get in Touch",
  description: "Contact the SP Fair Value team for questions about our options trading tools, subscription plans, or support.",
};

export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="uppercase text-5xl font-extrabold tracking-tight mb-6 text-gray-800 dark:text-white">
              <span className="text-gray-800 dark:text-gray-100">Get in</span>
              <span className="text-primary"> Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have questions about our tools or need support? We&apos;re here to help you succeed in your trading journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and our team will get back to you as soon as possible.
              </p>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      className="w-full p-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      className="w-full p-3"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full p-3"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="What is this regarding?"
                    className="w-full p-3"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you?"
                    className="w-full p-3 min-h-[150px]"
                  />
                </div>

                <Button className="group flex items-center text-primary-foreground bg-primary hover:bg-primary/90 py-6 px-8">
                  Send Message
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-10">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Contact Information</h2>
                <p className="text-muted-foreground mb-8">
                  Reach out directly through any of these channels or visit our office.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="p-6 bg-background/60 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex-shrink-0 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary"/>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Our Location</h3>
                      <address className="text-muted-foreground not-italic">
                        14673 Midway Rd, Suite 212,<br />
                        Addison, TX 75001
                      </address>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-background/60 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex-shrink-0 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary"/>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                      <a href="mailto:webmaster@spfairvalue.com" className="text-primary hover:underline">
                        webmaster@spfairvalue.com
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-background/60 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex-shrink-0 flex items-center justify-center">
                      <Phone className="h-6 w-6 text-primary"/>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                      <a href="tel:+12145551234" className="text-primary hover:underline">
                        (214) 555-1234
                      </a>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Map */}
              <div className="mt-8 rounded-xl overflow-hidden h-[300px] relative border border-border shadow-lg">
                <Image 
                  src="/assets/images/map-spfv.png" 
                  alt="Office Location Map"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Link href="https://maps.google.com/?q=14673+Midway+Rd,+Suite+212,+Addison,+TX+75001" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-white/90 hover:bg-white text-primary shadow-lg z-10">
                      Open in Google Maps
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="uppercase text-4xl font-bold mb-4 text-gray-800 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Quick answers to common questions about our services and support.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <Card className="p-6 bg-background/60 border-primary/10">
              <h3 className="text-xl font-bold mb-3">What are your support hours?</h3>
              <p className="text-muted-foreground">
                Our support team is available Monday through Friday from 9:00 AM to 5:00 PM Eastern Time. We strive to respond to all inquiries within 24 business hours.
              </p>
            </Card>

            <Card className="p-6 bg-background/60 border-primary/10">
              <h3 className="text-xl font-bold mb-3">How do I get started with SP Fair Value?</h3>
              <p className="text-muted-foreground">
                Simply sign up for an account, choose your subscription plan, and you&apos;ll gain immediate access to our suite of trading tools and community features.
              </p>
            </Card>

            <Card className="p-6 bg-background/60 border-primary/10">
              <h3 className="text-xl font-bold mb-3">Do you offer refunds?</h3>
              <p className="text-muted-foreground">
                Yes, we offer a 14-day money-back guarantee for new subscribers. If you&apos;re not satisfied with our service, contact us within 14 days of your purchase for a full refund.
              </p>
            </Card>

            <Card className="p-6 bg-background/60 border-primary/10">
              <h3 className="text-xl font-bold mb-3">Can I change my subscription plan?</h3>
              <p className="text-muted-foreground">
                Absolutely! You can upgrade, downgrade, or cancel your subscription at any time through your account dashboard or by contacting our support team.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Ready to Transform Your Trading?</h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
              Join thousands of traders who have improved their performance with SP Fair Value tools.
            </p>
            <Link href="/sign-up">
              <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-medium">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
