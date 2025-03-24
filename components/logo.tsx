import React from 'react';
import Image from "next/image";

const Logo = () => {
    return (
        <div className="h-8 w-8 lg:w-auto lg:h-auto rounded-lg flex items-center justify-center">
            <Image
                priority
                src="/spfv-short-logo.svg"
                width={44}
                height={44}
                alt="sp fair value logo"
                className="h-8 w-8 block md:hidden "
            />
            <Image
                priority
                src="/spfv-long-logo.svg"
                width={44}
                height={44}
                alt="sp fair value logo"
                className="h-auto w-44 hidden xl:block"
            />
        </div>
    );
};

export default Logo;