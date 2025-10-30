import { Button, Card } from "@heroui/react";
import { useAtom } from "jotai";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { mCategoryAtom } from "../../atoms/mCategoryAtom";

function MCategoryList({ editMode }) {
  const [mCategoryState] = useAtom(mCategoryAtom);

  return (
    <Card className="p-4 bg-slate-50 dark:bg-slate-900" shadow="sm">
      <div className="grid grid-cols-2 gap-4">
        {mCategoryState?.categories?.map((category, index) => (
          <div
            key={index}
            className="col-span-2 sm:col-span-1 border-1 border-gray-200 dark:border-gray-700 rounded-md p-4 flex justify-between items-center min-h-[66px]"
          >
            <div>
              <p className="capitalize text-lg">{category.categoryName}</p>
              <p className="text-sm">{category?.details}</p>
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
    </Card>
  );
}

export default MCategoryList;
