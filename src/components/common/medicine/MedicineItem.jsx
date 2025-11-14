import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Image,
} from "@heroui/react";
import { useAtom } from "jotai";
import React from "react";
import { FaCartPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { authAtom } from "../../../atoms/authAtom";
import { addToCartService } from "../../../api-services";

function MedicineItem({ data }) {
  const navigate = useNavigate();
  const [user, setAuth] = useAtom(authAtom);

  const onAddToCardHandler = async () => {
    if (!user?.loggedIn) {
      console.log("here need to navigate");
      navigate(`/login?fallback_url=/medicine/${data?._id}`);
    } else {
      console.log("Here will be logic for handle add to card");

      try {
        const response = await addToCartService.addToCard({
          medicineId: data?._id,
          quantity: data?.minOrder,
        });

        if (response.status === 200) {
          addToast({
            title: "Item added to cart",
            color: "success",
          });
          setAuth((pre) => ({
            ...pre,
            cartItemCount: pre.cartItemCount + 1,
            cartItems: [...pre.cartItems, data?._id],
          }));
        } else {
          addToast({
            title: response.data.message || "Something went wrong",
            color: "danger",
          });
        }
      } catch (error) {
        addToast({
          title:
            error?.data?.error ||
            error?.data?.message ||
            "Something went wrong",
          color: "danger",
        });
      }
    }
  };

  console.log(data?.discount);

  return (
    <Card shadow="sm">
      <Link to={`medicine/${data?._id}`}>
        <CardBody className="overflow-visible p-0 product-cart">
          <Image
            isZoomed
            alt={"item.title"}
            className="w-full object-cover h-[200px]"
            radius="lg"
            shadow="sm"
            src={data?.picUrl}
            fallbackSrc="https://amit-pharmacy-app.s3.eu-north-1.amazonaws.com/uploads/1763148065525-not-found.jpg"
            width="100%"
          />
          {data?.discount ? (
            <div className="absolute top-2 right-2 z-10">
              <Chip color="primary" variant="flat" size="md">
                Discount {data?.discount?.toFixed(2)} %
              </Chip>
            </div>
          ) : (
            ""
          )}
        </CardBody>
      </Link>
      <CardFooter className="text-small items-start flex-col gap-2 text-left justify-between">
        <Link to={`medicine/${data?._id}`} className="w-full">
          <div className="flex flex-col justify-between min-h-28 w-full">
            <p className="text-lg">{data?.medicineName}</p>
            <p className="text-sm text-left capitalize">
              {data?.generics_and_strengths
                ?.map((g) => g.generic.genericName)
                .join(" + ")}{" "}
              -{" "}
              {data?.generics_and_strengths?.map((g) => g.strength).join(" + ")}
            </p>
            <div className="flex justify-between w-full">
              <p className="text-base">
                Price:{" "}
                <span className="line-through font-normal text-sm text-gray-500">
                  {data?.originalPrice}
                </span>{" "}
                <span className="font-bold text-green-500">
                  {data?.discountPrice} BDT
                </span>
              </p>
            </div>
          </div>
        </Link>

        {data?.availableStatus ? (
          user?.cartItems?.some((item) => item === data?._id) ? (
            <Button fullWidth isDisabled color="primary" variant="flat">
              Already in cart
            </Button>
          ) : (
            <Button
              className="z-20"
              fullWidth
              endContent={<FaCartPlus className="h-5 w-5" />}
              onPress={onAddToCardHandler}
            >
              Add to Cart
            </Button>
          )
        ) : (
          <Button fullWidth isDisabled>
            Not available
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default MedicineItem;
