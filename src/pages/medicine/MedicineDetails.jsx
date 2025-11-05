import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Chip, Divider, Image } from "@heroui/react";
import { Link, useNavigate, useParams } from "react-router";
import PageHeader from "../../components/common/PageHeader";
import { FaCartPlus } from "react-icons/fa";
import { medicineService } from "../../api-services";
import { useAtom } from "jotai";
import { authAtom } from "../../atoms/authAtom";


export default function MedicineDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user] = useAtom(authAtom);
  const [qty, setQty] = React.useState(1);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchMedicineDetails = async () => {
      const response = await medicineService.getMedicineById(id);
      if (response.status === 200) {
        setData(response.data.result || {});
      }
    };
    fetchMedicineDetails();
  }, [id]);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  const onAddToCart = (qty) => {
    if (!user?.loggedIn) {
      console.log("here need to navigate");
      navigate(`/login?fallback_url=/medicine/${data?._id}`);
    } else {
      console.log("Here will be logic for handle add to card", { qty });
    }
  };

  return (
    <>
      <PageHeader label="Product" />

      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-6 text-foreground-500">
          <Link to="/" className="hover:underline">
            Home
          </Link>{" "}
          <span>›</span>{" "}
          <Link to="/medicines" className="hover:underline">
            Medicines
          </Link>{" "}
          <span>›</span>{" "}
          <span className="text-foreground">{data.medicineName || ""}</span>
        </nav>

        {/* Main */}
        <Card shadow="sm">
          <CardBody className="lg:p-6 p-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
              {/* Image */}
              <div className="md:col-span-6">
                <Image
                  alt={data.name}
                  src={data.picUrl}
                  radius="lg"
                  className="w-full h-auto max-h-[520px] object-contain bg-content2"
                />
              </div>

              {/* Info */}
              <div className="md:col-span-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <p className="text-xl">
                    Price:{" "}
                    <span className="font-normal line-through text-gray-500 text-lg">
                      {data?.originalPrice?.toFixed(2)} BDT
                    </span>{" "}
                    <span className="font-bold text-green-500">
                      {data?.discountPrice?.toFixed(2)} BDT
                    </span>
                  </p>
                  <Chip>
                    Discount: <span>{data.discount} %</span>
                  </Chip>
                </div>
                <h1 className="text-3xl font-semibold">
                  {data?.medicineName || ""}
                </h1>

                <div className="flex flex-col gap-2">
                  <p className="text-base capitalize">
                    Generic:{" "}
                    <Link
                      isExternal
                      to="#"
                      className="underline underline-offset-2"
                    >
                      {data?.generics_and_strengths
                        ?.map((g) => g.generic.genericName)
                        .join(" + ")}
                    </Link>
                  </p>
                  <p className="text-base  capitalize">
                    Strength:{" "}
                    <Link isExternal to="#" className="underline underline-offset-2">
                      {data?.generics_and_strengths
                        ?.map((g) => g.strength)
                        .join(" + ")}
                    </Link>
                  </p>

                  <p className="text-base capitalize">
                    Brand:{" "}
                    <Link to="#" className="underline underline-offset-2">
                      {data?.company?.company || ""} - (
                      {data?.company?.country || ""})
                    </Link>
                  </p>
                  <p className="text-base capitalize">
                    Medicine Form: {data?.unit}
                  </p>
                </div>

                {/* Quantity & Add to cart */}
                <div className="mt-4">
                  <Card
                    shadow="none"
                    className="border border-gray-200 dark:border-gray-800"
                  >
                    <CardBody className="flex flex-row items-center gap-4 py-3 px-4">
                      <div className="flex gap-4 items-center">
                        <QtyButton label="−" onClick={dec} />
                        <span className="min-w-6 text-center font-medium">
                          {qty}
                        </span>
                        <QtyButton label="+" onClick={inc} />
                      </div>
                      <Button
                        className="ml-auto"
                        radius="lg"
                        startContent={<FaCartPlus size={18} />}
                        onPress={() => onAddToCart(qty)}
                      >
                        Add To Cart
                      </Button>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>

            {/* Long sections */}
            <Divider className="my-8" />
            <div dangerouslySetInnerHTML={{ __html: data.description }} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}

function QtyButton({ label, onClick }) {
  return (
    <Button
      isIconOnly
      variant="flat"
      radius="lg"
      size="sm"
      className="bg-content2"
      onPress={onClick}
    >
      {label}
    </Button>
  );
}
