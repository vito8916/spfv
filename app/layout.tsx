import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Sp Fair Value",
    description: "A powerful tool for financial analysis and decision-making.",
    authors: [{name: "NSPRO'S", url: "https://nspros.io"}],
    openGraph: {
        title: "Sp Fair Value",
        description: "A powerful tool for financial analysis and decision-making.",
        url: "https://spfairvalue.com",
        siteName: "spfairvalue.com",
        images: [
            {
                url: "/supanext-kit.webp",
                width: 1200,
                height: 630,
                alt: "Sp Fair Value Preview",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Sp Fair Value",
        description: "A powerful tool for financial analysis and decision-making.",
        images: ["/supanext-kit.webp"],
    },
    metadataBase: new URL("https://spfairvalue.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
      >
          {children}
          <Toaster />
      </ThemeProvider>
      </body>
    </html>
  );
}
