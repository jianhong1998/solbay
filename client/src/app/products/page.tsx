import React from 'react'
import Card from '../../components/ui/Card'

const ProductList = () => {
  return (
    <>
      <div className='flex flex-col space-y-4 p-20'>
        <h1 className='text-4xl text-gray-500 font-extrabold'>Product Catalogue</h1>
        <p className='text-black-100 font-light'>Explore things you might like</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-4 p-4">
        <div className='h-[28rem]'>
        <Card title="Nike Shoe" price={0.2} description={'I am only selling one shoe because I only have 1 feet.'} imageUrl={"https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"} />
        </div>
        <div className='h-[28rem]'>
        <Card title="Wireless Keyboard" price={0.18} description={'Comes with RGB lights and free keycaps'} imageUrl={"https://m.media-amazon.com/images/I/61MC8BK0w0L._AC_SL1500_.jpg"}/>

        </div>
        <div className='h-[28rem]'>
        <Card title="JBL Headphones" price={1.2} description={'Brand new set with replacement ear cushions'} imageUrl={'https://m.media-amazon.com/images/I/51QSOQIOVEL._AC_SL1500_.jpg'}/>
        </div>

        <div className='h-[28rem]'>

        <Card title="Pokemon Gacha Machine" price={0.01} description={'If you like pokemon then this is a good gift'} imageUrl={'https://m.media-amazon.com/images/I/51MQ1lgN2gL._AC_SX466_.jpg'}/>
        </div>

      </div>
    </>
  )
}

export default ProductList