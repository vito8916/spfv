import { Footer } from "@/components/landing/footer"
import NavbarLanding from "@/components/landing/navbar"

export default function MarketingLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="h-full bg-background">
        <NavbarLanding />
        <main className="bg-background">
          {children}
        </main>
        <Footer />
      </div>
    )
  } 