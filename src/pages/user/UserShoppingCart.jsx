import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  DatePicker,
  Spinner,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { today, toCalendarDateTime } from "@internationalized/date";
import addToCartService from "../../api-services/addToCartService";
import { useNavigate } from "react-router";
import CartItems from "../../components/user/cart/CartItems";
import UserAddress from "../../components/user/user-address/UserAddress";

const DHAKA_TIMEZONE = "Asia/Dhaka";

const formatDateToISO = (calendarDate) => {
  if (!calendarDate) {
    const now = new Date();
    const dhakaDate = new Date(
      now.toLocaleString("en-US", { timeZone: DHAKA_TIMEZONE })
    );
    dhakaDate.setHours(11, 0, 0, 0);
    return dhakaDate.toISOString();
  }

  const dateTime = toCalendarDateTime(calendarDate, {
    hour: 11,
    minute: 0,
    second: 0,
  });
  return dateTime.toDate(DHAKA_TIMEZONE).toISOString();
};

function UserShoppingCart() {
  const navigate = useNavigate();
  const [value, setValue] = useState(today(DHAKA_TIMEZONE));
  const [cartData, setCartData] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await addToCartService.getCartItems();
        if (response.status === 200) {
          setCartData(response.data.data);
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

  const checkoutHandler = () => {
    const data = {
      cartId: cartData?.items?.[0]._id,
      paymentMethod: "COD",
      deliveryScheduledAt: formatDateToISO(value),
    };
    console.log("checkoutHandler");
    console.log(data);
    console.log({ value });
  };

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
          <Card
            shadow="sm"
            className="bg-gray-50 dark:bg-gray-900 col-span-2 h-fit"
          >
            <CartItems cartData={cartData} setCartData={setCartData} />
          </Card>

          <Card
            shadow="sm"
            className="bg-gray-50 dark:bg-gray-900 col-span-1 h-fit"
          >
            <CardBody>
              <div className="flex flex-col gap-4">
                <UserAddress />
              </div>

              <DatePicker
                label="Select Delivery Date"
                value={value}
                onChange={(date) => setValue(date)}
                className="mt-4"
                classNames={{
                  inputWrapper:
                    "bg-transparent border-1 border-gray-200 dark:border-gray-700",
                }}
              />

              <p className="text-lg font-semibold mt-10">
                Total Price: {cartData?.totalPrice?.toFixed(2)} Taka
              </p>

              <Button
                size="lg"
                
                onPress={checkoutHandler}
                className="mt-5 uppercase w-full bg-teal-400 text-2xl h-16 font-bold text-white"
              >
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
