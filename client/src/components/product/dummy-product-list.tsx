'use client';

import { FC } from 'react';

import Card from '../ui/Card';

type DummyProductListProps = {
  buyButtonOnClickFn: () => void;
};

const DummyProductList: FC<DummyProductListProps> = ({
  buyButtonOnClickFn,
}) => {
  return (
    <>
      <div className="h-[28rem]">
        <Card
          title="Nike Shoe"
          price={0.2}
          description={'I am only selling one shoe because I only have 1 feet.'}
          imageUrl={
            'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'
          }
          buyButtonOnClickFn={buyButtonOnClickFn}
        />
      </div>
      <div className="h-[28rem]">
        <Card
          title="Wireless Keyboard"
          price={0.18}
          description={'Comes with RGB lights and free keycaps'}
          imageUrl={
            'https://m.media-amazon.com/images/I/61MC8BK0w0L._AC_SL1500_.jpg'
          }
          buyButtonOnClickFn={buyButtonOnClickFn}
        />
      </div>
      <div className="h-[28rem]">
        <Card
          title="JBL Headphones"
          price={1.2}
          description={'Brand new set with replacement ear cushions'}
          imageUrl={
            'https://m.media-amazon.com/images/I/51QSOQIOVEL._AC_SL1500_.jpg'
          }
          buyButtonOnClickFn={buyButtonOnClickFn}
        />
      </div>

      <div className="h-[28rem]">
        <Card
          title="Pokemon Gacha Machine"
          price={0.01}
          description={'If you like pokemon then this is a good gift'}
          imageUrl={
            'https://m.media-amazon.com/images/I/51MQ1lgN2gL._AC_SX466_.jpg'
          }
          buyButtonOnClickFn={buyButtonOnClickFn}
        />
      </div>
    </>
  );
};

export default DummyProductList;
