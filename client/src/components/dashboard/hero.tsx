import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import CustomButton from '../ui/CustomButton';

const Hero = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push('/products');
  };
  return (
    <div className="hero">
      {/*text section*/}
      <div className="flex-1">
        <div>
          <h1 className="hero__title">
            Buy & Sell Goods with Your Crypto Wallet - Power your purchases
            Quick and Easy
          </h1>
        </div>
        <p className="hero__subtitle">
          Streamline your shopping experience with our effortless payment
          process.
        </p>

        <CustomButton
          title="Browse Products"
          containerStyles="bg-primary-blue text-white rounded-full mt-10"
          handleClick={handleClick}
        />
      </div>

      {/*image section*/}

      <div className="relative w-full md:w-1/2 h-[500px] md:h-[600px] mt-8 md:mt-0">
        <Image
          src="/herobg.png"
          alt="herobg"
          width={2800}
          height={2800}
          className="herobg object-contain absolute top-0 left-0 z-1 w-full h-full"
        />
        <Image
          src="/herofg.png"
          alt="herofg"
          width={2800}
          height={2800}
          className="herofg object-contain absolute top-0 left-0 z-2 w-full h-full"
        />
      </div>
    </div>
  );
};

export default Hero;
