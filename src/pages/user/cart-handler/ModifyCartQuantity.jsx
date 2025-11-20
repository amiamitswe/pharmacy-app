import { addToast, Button } from "@heroui/react";
import React from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa6";
import addToCartService from "../../../api-services/addToCartService";

function ModifyCartQuantity({ item, setCartData }) {
  const changeQuantityHandler = async (itemId, quantity) => {
    try {
      const response = await addToCartService.updateCartItemQuantity(
        itemId,
        quantity
      );

      if (response.status === 200) {
        setCartData((prev) => {
          const updatedItems = prev.items.map((cartItem) => {
            if (cartItem._id === itemId) {
              const updatedItem = {
                ...cartItem,
                quantity: quantity,
                totalItemPrice: cartItem.discountPrice * quantity,
              };
              return updatedItem;
            }
            return cartItem;
          });

          // Recalculate total price by summing all items
          const totalPrice = updatedItems.reduce(
            (sum, item) => sum + item.totalItemPrice,
            0
          );

          return { ...prev, items: updatedItems, totalPrice: totalPrice };
        });
      }
    } catch (error) {
      console.error(error.data.message);
      addToast({
        title: error?.data?.message || "Something went wrong",
        color: "danger",
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        isIconOnly
        isDisabled={item?.quantity === item?.medicine?.minOrder}
        onPress={() => changeQuantityHandler(item?._id, item?.quantity - 1)}
      >
        <FaMinus />
      </Button>
      <span className="text-lg font-bold">{item?.quantity}</span>
      <Button
        isIconOnly
        isDisabled={item?.quantity === item?.medicine?.maxOrder}
        onPress={() => changeQuantityHandler(item?._id, item?.quantity + 1)}
      >
        <FaPlus />
      </Button>

      <Button isIconOnly variant="light" color="danger">
        <FaTrash />
      </Button>
    </div>
  );
}

export default ModifyCartQuantity;
