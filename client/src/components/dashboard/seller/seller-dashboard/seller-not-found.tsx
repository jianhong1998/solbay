'use client';

import Link from 'next/link';

import PrimaryButton from '@/components/ui/buttons/primary-button';
import { GeneralClassName } from '@/constants/class-name.constant';

const SellerNotFoundDashboard = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div
        className={`flex flex-col items-center gap-5 ${GeneralClassName.PAGE_CONTENT_WIDTH}`}
      >
        <p className="text-2xl text-center">
          Seller is not found! You may go back to the home page by clicking the
          button bellow.
        </p>
        <Link href="/seller">
          <PrimaryButton>Home Page</PrimaryButton>
        </Link>
      </div>
    </div>
  );
};

export default SellerNotFoundDashboard;
