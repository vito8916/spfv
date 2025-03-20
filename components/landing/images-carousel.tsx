import React from 'react';
import Image from "next/image";

const ImagesCarousel = () => {
    return (
        <div className="home-page-image-carousel-item flex-shrink-0 flex justify-around gap-4 min-w-full">
            <div className="flex-shrink-0 flex justify-around gap-4 min-w-full animate-scroll">
                <Image width={808} height={487} src="/assets/images/pricing.png" alt="Pricing page illustration"/>
                <Image width={808} height={487} src="/assets/images/customer-portal.png" alt="Customer portal illustration"/>
            </div>
            <div className="flex-shrink-0 flex justify-around gap-4 min-w-full animate-scroll" aria-hidden="true">
                <Image width={808} height={487} src="/assets/images/pricing.png" alt="Pricing page illustration"/>
                <Image width={808} height={487} src="/assets/images/customer-portal.png" alt="Customer portal illustration"/>
            </div>
        </div>
    );
};

export default ImagesCarousel;