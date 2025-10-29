import { Button } from "@heroui/react";
import { useAtom } from "jotai";
import React from "react";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { medicineAtom } from "../../atoms/medicineAtom";

function MedicineList({ editMode }) {
  const [medicineState] = useAtom(medicineAtom);
  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-4">
          {medicineState?.medicines?.map((medicine, index) => (
          <div
            key={index}
            className="col-span-2 border-1 border-gray-200 dark:border-gray-700 rounded-md p-4 flex justify-between items-center min-h-[66px]"
          >
            <p className="capitalize text-lg">
              {medicine.medicineName}{" "}
              {/* <span className="text-sm text-gray-500">({company.country})</span> */}
            </p>

            {editMode && (
              <div className="flex flex-row gap-2">
                <Button size="sm" color="primary" variant="bordered" isIconOnly>
                  <BiEditAlt className="text-lg" />
                </Button>
                <Button size="sm" color="danger" variant="bordered" isIconOnly>
                  <BiTrash className="text-lg" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MedicineList;
