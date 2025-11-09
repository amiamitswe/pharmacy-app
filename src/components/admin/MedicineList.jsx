import { Button, Chip, Image } from "@heroui/react";
import { useAtom } from "jotai";
import React from "react";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { medicineAtom } from "../../atoms/medicineAtom";
import { BsEye } from "react-icons/bs";

function MedicineList({ editMode }) {
  const [medicineState] = useAtom(medicineAtom);

  if (medicineState?.loading) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
    );
  }

  return (
    <>
      {!medicineState?.medicines?.length && !medicineState?.loading ? (
        <p>No item found</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {medicineState?.medicines?.map((medicine, index) => (
            <div
              key={index}
              className="col-span-2 border-1 border-gray-200 dark:border-gray-700 rounded-md p-4 flex justify-between items-center min-h-[66px]"
            >
              <div className="flex gap-4 justify-between items-center w-full">
              <div className="flex gap-4">

                <div className="flex flex-col gap-4 items-center justify-between">
                  <div className="h-20 w-20">
                  <Image
                    alt="HeroUI hero Image"
                    src={medicine?.picUrl || "https://heroui.com/images/hero-card-complete.jpeg"}
                    width={80}
                    height={80}
                    classNames={{
                      wrapper: "h-20 w-20",
                    }}
                  />
                  </div>
                  <Button
                    size="sm"
                    color="primary"
                    variant="bordered"
                    className="flex md:hidden"
                    isIconOnly
                  >
                    <BsEye className="text-lg" />
                  </Button>
                </div>
                <div className="flex flex-col">
                <div className="flex flex-row items-end gap-4">
                  <h2 className="capitalize text-xl">{medicine.medicineName}</h2>
                  
                  <p className="text-sm">Available Stock:  <span>{medicine?.availableStatus ? <span className="text-success-300">Available </span> : <span className="text-danger-300">Out of Stock</span>}</span> </p>
                  {medicine?.availableStatus && 
                  <div className="text-sm">Stock:<Chip size="sm" variant="bordered" color="primary" className="ml-2">{medicine.medicineCount}</Chip></div>}
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <div>
                  {medicine?.generics_and_strengths?.length > 0 && (
                    <p className="capitalize text-sm"> <span className="font-medium">Generic:</span> {medicine.generics_and_strengths.map(item => item.generic.genericName).join(' + ')} - <span className="font-medium">Strength:</span> {medicine.generics_and_strengths.map(item => item.strength).join(' + ')}
                    </p>
                  )}
                  </div>
                    <div className="flex gap-4 flex-wrap">
                      <p className="capitalize text-sm">Company: {medicine.company.company}</p>
                      <p className="capitalize text-sm">Medicine Form: {medicine.medicine_form.medicineForm}</p>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <p className="capitalize text-sm">Price: {medicine.originalPrice}</p>
                      <p className="capitalize text-sm">Price: {medicine.discount}</p>
                      <p className="capitalize text-sm">Price: {medicine.discountPrice}</p>
                    </div>
                  </div>
                </div>

                </div>
                <Button
                    className="hidden md:flex"
                    size="sm"
                    color="primary"
                    variant="bordered"
                    isIconOnly
                  >
                    <BsEye className="text-lg" />
                  </Button>
              </div>

              {editMode && (
                <div className="flex flex-row gap-2 ml-2">
                  <Button
                    size="sm"
                    color="primary"
                    variant="bordered"
                    isIconOnly
                  >
                    <BiEditAlt className="text-lg" />
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="bordered"
                    isIconOnly
                  >
                    <BiTrash className="text-lg" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default MedicineList;
