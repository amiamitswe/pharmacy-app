import { Button, Card, Chip, Image } from "@heroui/react";
import { useAtom } from "jotai";
import React from "react";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { usersAtom } from "../../atoms";

function UsersList({ editMode }) {
  const [usersState] = useAtom(usersAtom);
  return (
    <Card className="p-4 bg-slate-50 dark:bg-slate-900" shadow="sm">
        {!usersState?.users?.length && !usersState?.loading ? (
        <p>No Users found</p>
      ) : (
    
      <div className="grid grid-cols-2 gap-4">
        {usersState?.users?.map((user, index) => (
          <div
            key={index}
            className="col-span-2 sm:col-span-1 border-1 border-gray-200 dark:border-gray-700 rounded-md p-4 flex justify-between items-center min-h-[66px]"
          >
            <div className="flex items-center gap-4">
              <Image
                alt="HeroUI hero Image"
                src={
                  user?.image_url ||
                  "https://heroui.com/images/hero-card-complete.jpeg"
                }
                width={60}
                height={60}
              />

              <div>
                <h2 className="capitalize text-lg flex items-center gap-4">
                  {user.name}{" "}
                  <Chip
                    size="sm"
                    color={user.orderCount > 0 ? "success" : "danger"}
                    variant="flat"
                    className="h-4"
                  >
                    {user.orderCount || 0}
                  </Chip>
                </h2>
                <p className="capitalize text-xs">{user.email}</p>
                <p className="capitalize text-xs">{user.phone}</p>
              </div>
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
      </div>)}
    </Card>
  );
}

export default UsersList;
