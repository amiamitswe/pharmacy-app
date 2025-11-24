import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  DatePicker,
  Radio,
  RadioGroup,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { today, toCalendarDateTime } from "@internationalized/date";
import addToCartService from "../../api-services/addToCartService";
import { useNavigate } from "react-router";
import CartItems from "../../components/user/cart/CartItems";
import UserAddress from "../../components/user/user-address/UserAddress";
import { orderService } from "../../api-services";
import { FaAddressCard } from "react-icons/fa";
import { useSetAtom } from "jotai";
import { authAtom } from "../../atoms/authAtom";

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
 
  const setAuth = useSetAtom(authAtom);

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

  const checkoutHandler = async () => {
    const data = {
      cartId: cartData?._id,
      paymentMethod: "cod",
      deliveryScheduledAt: formatDateToISO(value),
    };

    console.log(data);

    try {
      const response = await orderService.placeOrder(data);
      if (response.status === 201) {
        addToast({
          title: "Order placed successfully",
          color: "success",
        });

        setAuth((pre) => ({
          ...pre,
          cartItemCount: pre.cartItemCount - cartData?.items?.length,
          cartItems: pre.cartItems.filter((item) => item !== cartData?._id),
        }));

        navigate("/user/orders");
      } else {
        addToast({
          title: response.data.message || "Something went wrong",
          color: "danger",
        });
      }
    } catch (error) {
      console.log(error);
      addToast({
        color: "danger",
        description: error?.data?.message || "Something went wrong",
      });
    }
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
              <div className="flex flex-col gap-2 relative group ">
                <UserAddress />
                <div className="absolute h-full w-full bg-gray-200/50 rounded-lg hidden group-hover:block"></div>
                <Button
                  variant="solid"
                  color="primary"
                  onPress={() => navigate("/user/address-book")}
                  className="absolute z-10 hidden group-hover:flex left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <FaAddressCard className="text-white" />
                  Change Default Address
                </Button>
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

              <div className="border-1 border-gray-200 dark:border-gray-700 p-3 mt-4 rounded-xl">
                <RadioGroup label="Payment method" value="cod">
                  <Radio value="cod">Cash on delivery</Radio>
                </RadioGroup>
              </div>

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
