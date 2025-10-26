import React from "react";

function ProductItem({ data }) {
  return (
    <a href="#" className="group">
      <img
        src="https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg"
        alt={data?.medicineName}
        className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
      />
      <h3 className="mt-4 text-sm ">{data?.medicineName}</h3>
        <p className="mt-1 text-lg font-medium">
          Price:  {data?.discountPrice} BDT <span className="text-base line-through">{data?.originalPrice} BDT</span>
        </p>
        
    </a>
  );
}

export default ProductItem;
