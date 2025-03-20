import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CTAButtonProps {
  title: string;
}

export function CTAButton({ title }: CTAButtonProps) {
  return (
    <div>
        <Link href="/sign-up">
            <Button className="bg-primary text-white hover:bg-primary/90 font-bold px-8 py-6">
                {title}
            </Button>
        </Link>
    </div>
  )
}
