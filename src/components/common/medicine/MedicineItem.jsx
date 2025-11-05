import { Button, Card, CardBody, CardFooter, Image } from "@heroui/react";
import { useAtom } from "jotai";
import React from "react";
import { FaCartPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { authAtom } from "../../../atoms/authAtom";

function MedicineItem({ data }) {
  const navigate = useNavigate();
  const [user] = useAtom(authAtom);

  const onAddToCardHandler = () => {
    console.log(user);
    if (!user?.loggedIn) {
      console.log("here need to navigate");
      navigate(`/login?fallback_url=/medicine/${data?._id}`);
    } else {
      console.log("Here will be logic for handle add to card");
    }
  };

  return (
    <Card shadow="sm">
      <Link to={`medicine/${data?._id}`}>
        <CardBody className="overflow-visible p-0">
          <Image
            isZoomed
            alt={"item.title"}
            className="w-full object-cover h-[200px]"
            radius="lg"
            shadow="sm"
            src={data?.picUrl}
            fallbackSrc="https://avatars.githubusercontent.com/u/30245543?v=4"
            width="100%"
          />
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

        <Button
          className="z-20"
          fullWidth
          endContent={<FaCartPlus className="h-5 w-5" />}
          // ⬇️ use onPress for HeroUI Button
          onPress={onAddToCardHandler}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

export default MedicineItem;
