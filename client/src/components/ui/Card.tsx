import React, { MouseEventHandler } from 'react';

import { PLACEHOLDER_IMAGE_URL } from '@/constants/url.constant';
import { NumberDisplayHelper } from '@/utils/shared/display-helper/number-display-helper';

import PrimaryButton from './buttons/primary-button';

interface ICard {
  title: string;
  price: number;
  description?: string;
  imageUrl?: string;
  cardOnClickFn?: MouseEventHandler<HTMLDivElement>;
  buyButtonOnClickFn?: MouseEventHandler<HTMLButtonElement>;
}

const Card: React.FC<ICard> = (props) => {
  const {
    title = 'Placeholder Title',
    price,
    description = '-',
    imageUrl = PLACEHOLDER_IMAGE_URL,
    cardOnClickFn: onClickFn,
    buyButtonOnClickFn,
  } = props;
  return (
    <div
      className={`card bg-base-100 shadow-sm h-full dark:bg-gray-900 ${onClickFn ? 'cursor-pointer' : ''}`}
      onClick={onClickFn}
    >
      {' '}
      {/* Ensure card takes full height */}
      <figure className="w-full h-72">
        {' '}
        {/* Fixed height for the image container */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover" /* Scale image to cover the area */
        />
      </figure>
      <div className="card-body flex flex-col justify-between h-48">
        {' '}
        {/* Fixed height for card body */}
        <div>
          <h2 className="card-title text-lg">{title}</h2>
          <p className="text-sm line-clamp-2">{description}</p>{' '}
          {/* Limit description to 2 lines */}
        </div>
        <div>
          <p className="text-sm">
            Price:{' '}
            {price > 0
              ? NumberDisplayHelper.convertNumberToDisplayString(price)
              : '-'}{' '}
            USDC
          </p>
          <div className="card-actions justify-end mt-2">
            {buyButtonOnClickFn && (
              <PrimaryButton
                className="btn-sm"
                buttonStyle="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  buyButtonOnClickFn?.(e);
                }}
              >
                Buy
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
