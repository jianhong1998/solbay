'use client';

import { FC, useMemo } from 'react';

import NumberInput from '@/components/ui/inputs/number-input';
import { PLACEHOLDER_IMAGE_URL } from '@/constants/url.constant';
import { NumberDisplayHelper } from '@/utils/shared/display-helper/number-display-helper';

type CheckoutProductListItemProps = {
  productId: string;
  productName: string;
  productAvailableQuantity: number;
  unitPrice: number;
  quantity: number;
  setQuantity: (params: { productId: string; quantity: number }) => void;
  disableQuantityChange: boolean;
  imageUrl?: string;
  hideAvailableQuantity?: boolean;
};

const CheckoutProductListItem: FC<CheckoutProductListItemProps> = ({
  productId,
  productName,
  productAvailableQuantity,
  unitPrice,
  quantity,
  setQuantity,
  disableQuantityChange,
  imageUrl = PLACEHOLDER_IMAGE_URL,
  hideAvailableQuantity = false,
}) => {
  const unitPriceDisplayString = useMemo(
    () =>
      NumberDisplayHelper.convertNumberToDisplayString(
        NumberDisplayHelper.convertMicroUsdcToUsdc(unitPrice),
      ),
    [unitPrice],
  );

  const subTotalPriceDisplayString = useMemo(() => {
    const subTotal = quantity * unitPrice;
    return NumberDisplayHelper.convertNumberToDisplayString(
      NumberDisplayHelper.convertMicroUsdcToUsdc(subTotal),
    );
  }, [unitPrice, quantity]);

  const handleQuantityUpdate = (value: number) => {
    setQuantity({ productId, quantity: value });
  };

  return (
    <tr>
      {/* Image */}
      <td>
        <div className="flex items-center">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img
                src={imageUrl}
                alt={`Product image for ${productName}`}
              />
            </div>
          </div>
        </div>
      </td>
      {/* Name & Available Quantity */}
      <td>
        <div className="font-bold">{productName}</div>
        {!hideAvailableQuantity && (
          <div className="text-gray-400 dark:text-gray-600">
            Available:{' '}
            <span className="font-bold">{productAvailableQuantity}</span>
          </div>
        )}
      </td>
      {/* Unit Price */}
      <td className="font-bold">{unitPriceDisplayString}</td>
      {/* Quanitty */}
      <td>
        <NumberInput
          value={quantity}
          setValue={handleQuantityUpdate}
          disabled={disableQuantityChange}
        />
      </td>
      {/* Sub-Total */}
      <td className="font-bold">{subTotalPriceDisplayString}</td>
    </tr>
  );
};

export default CheckoutProductListItem;
