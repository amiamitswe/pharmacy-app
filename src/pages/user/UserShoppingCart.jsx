import { addToast, Button, Card, CardBody, CardHeader } from "@heroui/react";
import React, { useEffect, useState } from "react";
import addToCartService from "../../api-services/addToCartService";
import { useNavigate } from "react-router";
import UserAddress from "../../components/user/user-address/UserAddress";
import CartItems from "../../components/user/cart/CartItems";

function UserShoppingCart() {
  const navigate = useNavigate();
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
      <Card shadow="sm" className="bg-gray-50 dark:bg-gray-900">
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
      {cartData?.items?.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          <Card shadow="sm" className="bg-gray-50 dark:bg-gray-900 col-span-2">
            <CartItems cartData={cartData} setCartData={setCartData} />
          </Card>

          <Card shadow="sm" className="bg-gray-50 dark:bg-gray-900 col-span-1">
            <CardBody>
              <div className="flex flex-col gap-4">
                <UserAddress onlyDefault />
              </div>
              <p>Total Price: {cartData?.totalPrice?.toFixed(2)} Taka</p>

              <Button onPress={() => {}} className="mt-5">
                Checkout
              </Button>
            </CardBody>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <p className="text-lg font-semibold">No items in cart</p>
          <Button onPress={() => navigate("/")} className="mt-5">
            Go to Home
          </Button>
        </div>
      )}
    </div>
  );
}

export default UserShoppingCart;
