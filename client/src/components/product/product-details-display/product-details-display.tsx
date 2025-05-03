'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';

import LinkButton from '@/components/ui/buttons/link-button';
import { IProductWithoutSensitiveData } from '@/types/product/product-without-sensitive-data.type';
import { NumberDisplayHelper } from '@/utils/shared/display-helper/number-display-helper';

import BuyButton from './components/buy-button';
import EditButton from './components/edit-button';

type ProductDetailsDisplayProps = {
  productDetails: IProductWithoutSensitiveData;
  sellerMode?: boolean;
  sellerId?: string;
};

const ProductDetailsDisplay: FC<ProductDetailsDisplayProps> = ({
  productDetails,
  sellerMode = false,
  sellerId,
}) => {
  const productImageUrl = 'https://placehold.co/600x400';
  const enableEditProduct = false;

  const router = useRouter();

  const handleBackToProductListPage = () => {
    if (sellerMode) {
      router.push(`/seller/${sellerId}/product`);
    } else {
      router.push('/products');
    }
  };

  return (
    <div className="mx-auto sm:max-w-md lg:max-w-4xl">
      <div>
        <LinkButton onClick={handleBackToProductListPage}>Back</LinkButton>
      </div>

      {/* Card */}
      <div className="shadow-xl rounded-3xl">
        <figure className="w-full h-72">
          <img
            src={productImageUrl}
            alt={`Product image for ${productDetails.name}`}
            className="w-full h-full object-cover rounded-t-3xl"
          />
        </figure>

        <div className="flex flex-col gap-3 px-5 pt-5 pb-7">
          {/* Product Name */}
          <div className="flex flex-row justify-between">
            <div>
              <p className="text-2xl text-wrap font-bold">
                {productDetails.name}
              </p>
              <p className="tex-wrap text-gray-400">
                {productDetails.seller?.name}
              </p>
            </div>

            {!sellerMode && (
              <div>
                <BuyButton productId={productDetails.uuid} />
              </div>
            )}

            {sellerMode && (
              <div>
                <EditButton
                  productId={productDetails.uuid}
                  disable={!enableEditProduct}
                />
              </div>
            )}
          </div>

          {/* Product Price */}
          <div>
            Price:{' '}
            {NumberDisplayHelper.convertLamportToSol(
              productDetails.priceInLamport,
            )}{' '}
            SOL
          </div>

          <div className="divider">
            <p className="text-gray-400">Product Description</p>
          </div>

          {/* Product Description */}
          <div className="text-wrap">
            {productDetails.description.split('\n').map((value) => (
              <>
                <p key={value.slice(0, 20)}>{value}</p>
                <br />
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsDisplay;
