import React from 'react'

interface ICard {
 title: string;
 price: number;
 description: string;
 imageUrl: string;
}

const Card: React.FC<ICard> = (props) => {
    const {title="Placeholder Title", price = "-", description='-', imageUrl="https://placehold.co/600x400"} = props
  return (
   
    <div className="card bg-base-100 shadow-sm h-full"> {/* Ensure card takes full height */}
    <figure className="w-full h-72"> {/* Fixed height for the image container */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover" /* Scale image to cover the area */
      />
    </figure>
    <div className="card-body flex flex-col justify-between h-48"> {/* Fixed height for card body */}
      <div>
        <h2 className="card-title text-lg">{title}</h2>
        <p className="text-sm line-clamp-2">{description}</p> {/* Limit description to 2 lines */}
      </div>
      <div>
        <p className="text-sm">Price: {price} SOL</p>
        <div className="card-actions justify-end mt-2">
          <button className="btn btn-primary btn-sm">Buy Now</button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Card