import React from 'react'

interface ICard {
 title: string;
 price: number;
 description: string;
}

const Card: React.FC<ICard> = (props) => {
    const {title="Placeholder Title", price = "-", description='-'} = props
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
    <figure>
      <img
        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
        alt="Shoes" />
    </figure>
    <div className="card-body">
      <h2 className="card-title">{title}</h2>
      <p>{description}</p>
      <p>Price: {price} SOL</p>
      <div className="card-actions justify-end">
        <button className="btn btn-primary">Buy Now</button>
      </div>
    </div>
  </div>
  )
}

export default Card