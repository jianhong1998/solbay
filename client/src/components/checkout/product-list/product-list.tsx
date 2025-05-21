'use client';

import { FC } from 'react';

import { IProductWithoutSensitiveData } from '@/types/product/product-without-sensitive-data.type';

import CheckoutProductListItem from './product-list-item';

type CheckoutProductListProps = {
  products: IProductWithoutSensitiveData[];
  isSubmitting: boolean;
  productQuantities: Record<string, number>;
  setProductQuantities: (params: {
    productId: string;
    quantity: number;
  }) => void;
};

const CheckoutProductList: FC<CheckoutProductListProps> = ({
  products,
  isSubmitting,
  productQuantities,
  setProductQuantities,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Product Image</th>
            <th>Product Name</th>
            <th>Unit Price (USDC)</th>
            <th>Quantity</th>
            <th>Sub-Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            return (
              <CheckoutProductListItem
                key={product.uuid}
                productId={product.uuid}
                productName={product.name}
                productAvailableQuantity={product.availableQuantity}
                unitPrice={product.priceInMicroUsdc}
                quantity={productQuantities[product.uuid]}
                setQuantity={setProductQuantities}
                disableQuantityChange={isSubmitting}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CheckoutProductList;
