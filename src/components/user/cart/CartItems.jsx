import React from "react";
import ModifyCartQuantity from "./cart-handler/ModifyCartQuantity";
import { CardBody, Image } from "@heroui/react";

function CartItems({ cartData, setCartData }) {
  return (
    <CardBody>
      <div className="flex flex-col gap-4">
        {cartData?.items?.map((item) => (
          <div
            key={item._id}
            className="flex gap-4 items-center justify-between border-1 border-gray-200 dark:border-gray-700 rounded-md p-2"
          >
            <div className="flex items-center gap-4">
              <Image
                className="w-16 h-16 object-cover"
                src={item?.medicine?.picUrl}
                alt={item?.medicine?.medicineName}
              />
              <p>{item?.medicine?.medicineName}</p>
              <p>
                {item?.discountPrice?.toFixed(2)} X {item?.quantity} ={" "}
                {item?.totalItemPrice?.toFixed(2)} Taka
              </p>
            </div>

            <ModifyCartQuantity item={item} setCartData={setCartData} />
          </div>
        ))}
      </div>
    </CardBody>
  );
}

export default CartItems;
