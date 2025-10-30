import React from "react";
import { medicineGenericAtom } from "../../atoms/medicineGenericAtom";
import { Button, Card, Chip } from "@heroui/react";
import { useAtom } from "jotai";
import { BiEditAlt, BiTrash } from "react-icons/bi";

function MedicineGenericList({ editMode }) {
  const [mGenericState] = useAtom(medicineGenericAtom);

  if (mGenericState?.loading) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
    );
  }

  return (
    <Card className="p-4 bg-slate-50 dark:bg-slate-900" shadow="sm">
      {!mGenericState?.generics?.length ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No data found
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {mGenericState?.generics?.map((generic, index) => (
            <div
              key={index}
              className="col-span-2 sm:col-span-1 border-1 border-gray-200 dark:border-gray-700 rounded-md p-4 flex justify-between items-center min-h-[66px]"
            >
              <div>
                <p className="capitalize text-lg">{generic?.genericName}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {generic?.strength?.map((strength, index) => (
                    <Chip color="primary" variant="flat" key={index} size="md">
                      {strength}
                    </Chip>
                  ))}
                </div>
              </div>

              {editMode && (
                <div className="flex flex-row gap-2">
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
    </Card>
  );
}

export default MedicineGenericList;
