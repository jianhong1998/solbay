'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';
import toast from 'react-hot-toast';

import Card from '@/components/ui/Card';
import { useGetSellerProductList } from '@/hooks/queries/products/sellers/get-seller-product';
import { NumberDisplayHelper } from '@/utils/shared/display-helper/number-display-helper';
import { ErrorHandler } from '@/utils/shared/error-handler';

const SellerProductDashboard: FC = () => {
  const router = useRouter();

  const { publicKey } = useWallet();
  const { data: sellerProductList, error: getSellerProductListError } =
    useGetSellerProductList(publicKey);

  useEffect(() => {
    if (!getSellerProductListError) return;

    const errorStatus = ErrorHandler.extractStatusCodeFromError(
      getSellerProductListError,
    );
    const errorMessage = ErrorHandler.extractErrorMessage(
      getSellerProductListError,
    );

    switch (errorStatus) {
      case 401:
      case 403:
        router.replace('/seller');
        return;
      default:
        break;
    }

    toast.error(errorMessage);
  }, [getSellerProductListError, router]);

  if (!sellerProductList) {
    return (
      <div>
        <span className="loading loading-spinner" />
      </div>
    );
  }

  if (!sellerProductList.products.length) {
    return <div>No product listed yet.</div>;
  }

  return (
    <div className="flex flex-row flex-wrap gap-x-5 gap-y-10 justify-center mt-5">
      {sellerProductList.products.map((product) => {
        return (
          <div key={`product-${product.uuid}"`}>
            <Card
              title={product.name}
              price={NumberDisplayHelper.convertLamportToSol(
                product.priceInLamport,
              )}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SellerProductDashboard;
