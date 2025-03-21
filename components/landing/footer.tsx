import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <>
      <footer className="px-6 py-10 border-t border-border bg-background-secondary dark:bg-gray-800">
        <div className="mx-auto max-w-screen-xl">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0 space-y-4">
              <Link href="/" className="flex items-center">
                <Image
                  src="/spfv-long-logo.svg"
                  width={44}
                  height={44}
                  alt="sp fair value logo"
                  className="h-auto w-44"
                />
              </Link>
              <address className="text-muted-foreground not-italic">
                14673 Midway Rd, Suite 212,
                <br />
                Addison, TX 75001
                <br />
                <a
                  href="mailto:webmaster@spfairvalue.com"
                  className="text-primary hover:underline"
                >
                  webmaster@spfairvalue.com
                </a>
              </address>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                  Resources
                </h2>
                <ul className="text-gray-600 dark:text-gray-400">
                  <li className="mb-4">
                    <Link href="/blog" className="hover:underline">
                      SPFV Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs" className="hover:underline">
                      Documentation
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                  Product
                </h2>
                <ul className="text-gray-600 dark:text-gray-400">
                  <li className="mb-4">
                    <Link href="/about" className="hover:underline">
                      About SPFV
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="hover:underline"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                  Legal
                </h2>
                <ul className="text-gray-600 dark:text-gray-400">
                  <li className="mb-4">
                    <Link href="/privacy" className="hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:underline">
                      Terms &amp; Conditions
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
              © {new Date().getFullYear()} SpFairValue. All rights reserved.
            </span>
            <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
              {/* TODO: Add social media links */}
              <a href="https://x.com/spfairvalue" className="hover:underline">
                X
              </a>
              <a href="https://www.instagram.com/spfairvalue" className="hover:underline">
                Instagram
              </a>
              <a href="https://www.facebook.com/spfairvalue" className="hover:underline">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
