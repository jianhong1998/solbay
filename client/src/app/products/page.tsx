'use client';

import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import React from 'react';

import Card from '@/components/ui/Card';
import FullPageLoading from '@/components/ui/loading/full-page-loading';
import { useGetBuyerProductList } from '@/hooks/queries/products/buyers/get-product';
import { NumberDisplayHelper } from '@/utils/shared/display-helper/number-display-helper';

const ProductList: NextPage = () => {
  const router = useRouter();

  const { data: productList, isFetched: isGetProductListExecuted } =
    useGetBuyerProductList();

  // TODO: Implement buy feature
  const generateBuyButtonOnClickFn = (productId: string) => () => {
    router.push(encodeURI(`/checkout?productId=${productId}`));
  };

  const generateViewProductDetailsHandler = (productId: string) => () => {
    router.push(`/products/${productId}`);
  };

  return (
    <>
      <div className="flex flex-col space-y-4 p-20">
        <h1 className="text-4xl text-gray-500 font-extrabold">
          Product Catalogue
        </h1>
        <p className="text-black-100 font-light">
          Explore things you might like
        </p>
      </div>
      {!isGetProductListExecuted && <FullPageLoading />}
      {!Boolean(productList?.products.length) && isGetProductListExecuted && (
        <div className="flex flex-col justify-center items-center w-full">
          <h1 className="text-lg text-gray-400">
            Sellers not yet published their products
          </h1>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-4 p-4">
        {productList?.products.map((product) => (
          <div
            key={product.uuid}
            className="h-[28rem]"
          >
            <Card
              title={product.name}
              price={NumberDisplayHelper.convertMicroUsdcToUsdc(
                product.priceInMicroUsdc,
              )}
              cardOnClickFn={generateViewProductDetailsHandler(product.uuid)}
              buyButtonOnClickFn={generateBuyButtonOnClickFn(product.uuid)}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductList;
