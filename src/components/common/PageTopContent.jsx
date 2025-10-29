"use client";
import { Button, Input } from "@heroui/react";
import { BiEdit } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { CiCirclePlus } from "react-icons/ci";

function PageTopContent({
  title,
  count,
  showEditMode = false,
  editMode,
  setEditMode,
  addNewButtonClick = () => {},
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-xl">
        {title} {count ? `(${count})` : ""}
      </h1>
      <div className="flex items-center gap-4">
        <Input placeholder="Search here ..." variant="bordered" />
        <Button
          color="success"
          variant="bordered"
          className="w-[200px]"
          startContent={<CiCirclePlus className="text-2xl" />}
          onPress={addNewButtonClick}
        >
          Add new
        </Button>
        {showEditMode && (
          <Button
            color={editMode ? "danger" : "primary"}
            variant="bordered"
            className="w-[200px]"
            onPress={() => setEditMode(!editMode)}
          >
            {!editMode ? (
              <BiEdit className="text-2xl" />
            ) : (
              <CgClose className="text-2xl" />
            )}{" "}
            {!editMode ? "Edit Mode" : "Close Edit"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default PageTopContent;
