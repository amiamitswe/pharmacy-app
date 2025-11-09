import { Button, Card } from "@heroui/react";
import { useAtom } from "jotai";
import React from "react";
import { companyAtom } from "../../atoms/companyAtom";
import { BiEditAlt, BiTrash } from "react-icons/bi";

function CompanyList({ editMode }) {
  const [companyState] = useAtom(companyAtom);
  return (
    <Card className="p-4 bg-slate-50 dark:bg-slate-900" shadow="sm">
      {!companyState?.companies?.length && !companyState?.loading ? (
        <p>No item found</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {companyState?.companies?.map((company, index) => (
            <div
              key={index}
              className="col-span-2 sm:col-span-1 border-1 border-gray-200 dark:border-gray-700 rounded-md p-4 flex justify-between items-center min-h-[66px]"
            >
              <p className="capitalize text-lg">
                {company.company}{" "}
                <span className="text-sm text-gray-500">
                  ({company.country})
                </span>
              </p>

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

export default CompanyList;
