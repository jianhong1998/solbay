'use client';

import Link from 'next/link';

import PrimaryButton from '@/components/ui/buttons/primary-button';
import { GeneralClassName } from '@/constants/class-name.constant';

const ProductNotFound = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div
        className={`flex flex-col items-center gap-5 ${GeneralClassName.PAGE_CONTENT_WIDTH}`}
      >
        <p className="text-2xl text-center">
          Product is not found! You may browse other products by clicking the
          button below.
        </p>
        <Link href="/products">
          <PrimaryButton>Browse Other Products</PrimaryButton>
        </Link>
      </div>
    </div>
  );
};

export default ProductNotFound;
