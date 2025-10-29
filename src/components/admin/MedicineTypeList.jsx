import { Button, Chip } from "@heroui/react";
import { useAtom } from "jotai";
import React from "react";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { medicineTypeAtom } from "../../atoms/medicineTypeAtom";

function MedicineTypeList({ editMode }) {
  const [medicineTypeState] = useAtom(medicineTypeAtom);
  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-4">
        {medicineTypeState?.medicineTypes?.map((type, index) => (
          <div
            key={index}
            className="col-span-2 border-1 border-gray-200 dark:border-gray-700 rounded-md p-4 flex justify-between items-center min-h-[66px]"
          >
            <div className="flex gap-2 items-center">
              <p className="capitalize text-lg">{type.medicineType}</p>
              <Chip size="sm" color={type?.active ? "success" : "danger"}>
                {type?.active ? "Active" : "Inactive"}
              </Chip>
            </div>

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

export default MedicineTypeList;
