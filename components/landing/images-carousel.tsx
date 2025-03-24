import React from "react";
import Image from "next/image";

const ImagesCarousel = () => {
  return (
    <div className="flex-shrink-0 flex justify-around gap-4 min-w-full overflow-x-hidden">
      <div className="flex-shrink-0 flex justify-around gap-4 min-w-full animate-scroll">
        <Image
          className="rounded-t-2xl"
          width={808}
          height={487}
          src="/assets/images/bienvenida.jpg"
          alt="Pricing page illustration"
        />
        <Image
        className="rounded-t-2xl"
          width={808}
          height={487}
          src="/assets/images/bienvenida.jpg"
          alt="Customer portal illustration"
        />
      </div>
      <div
        className="flex-shrink-0 flex justify-around gap-4 min-w-full animate-scroll"
        aria-hidden="true"
      >
        <Image
          className="rounded-t-2xl"
          width={808}
          height={487}
          src="/assets/images/bienvenida.jpg"
          alt="Pricing page illustration"
        />
        <Image
          className="rounded-t-2xl"
          width={808}
          height={487}
          src="/assets/images/bienvenida.jpg"
          alt="Customer portal illustration"
        />
      </div>
    </div>
  );
};

export default ImagesCarousel;
