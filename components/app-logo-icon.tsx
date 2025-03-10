import Image from "next/image";

export default function AppLogoIcon() {
    return (
        <Image
            width={44}
            height={44}
            src="/spfv-short-logo.svg"
            alt="sp fair value logo"
            className="h-4 w-4 text-primary-foreground" />
    );
}
