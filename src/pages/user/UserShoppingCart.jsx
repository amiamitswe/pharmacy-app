import { addToast, Card, CardBody, CardHeader, Image } from "@heroui/react";
import React, { useEffect, useState } from "react";
import addToCartService from "../../api-services/addToCartService";

import ModifyCartQuantity from "./cart-handler/ModifyCartQuantity";

function UserShoppingCart() {
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await addToCartService.getCartItems();
        if (response.status === 200) {
          setCartData(response.data.data);
          console.log(response.data.data);
        } else {
          addToast({
            title: response.data.message || "Something went wrong",
            color: "danger",
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCartItems();
  }, []);

  // console.log({ cartData });

  return (
    <div className="flex flex-col gap-4">
      <Card shadow="sm">
        <CardHeader className="flex justify-between items-center">
          <p className="text-lg font-semibold">
            Shopping Cart{" "}
            {cartData?.items?.length && (
              <span className="text-gray-500">({cartData?.items?.length})</span>
            )}
          </p>

          <p className="text-lg font-bold">
            Total Price: {cartData?.totalPrice?.toFixed(2)} Taka
          </p>
        </CardHeader>
      </Card>
      <Card shadow="sm">
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
      </Card>
    </div>
  );
}

export default UserShoppingCart;
