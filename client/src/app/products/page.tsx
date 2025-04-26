import React from 'react'
import Card from '../../components/ui/Card'

const ProductList = () => {
  return (
    <>
      <div className='flex flex-col space-y-4 p-20'>
        <h1 className='text-4xl text-gray-500 font-extrabold'>Product Catalogue</h1>
        <p className='text-black-100 font-light'>Explore things you might like</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        <Card title="Nike Shoe" price={0.2} description={'I am only selling one shoe because I only have 1 feet.'} />
        <Card title="Nike Shoe" price={0.2} description={'I am only selling one shoe because I only have 1 feet.'}/>
        <Card title="Nike Shoe" price={0.2} description={'I am only selling one shoe because I only have 1 feet.'}/>
        <Card title="Nike Shoe" price={0.2} description={'I am only selling one shoe because I only have 1 feet.'}/>
      </div>
    </>
  )
}

export default ProductList