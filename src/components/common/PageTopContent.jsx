"use client";
import { Button, Input } from "@heroui/react";
import { BiEdit, BiSearch } from "react-icons/bi";
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
    <div className="flex md:items-center flex-col md:flex-row justify-between mb-4 gap-4">
      <h1 className="text-xl">
        {title} {count ? `(${count})` : ""}
      </h1>
      <div className="flex items-center gap-4">
        <Input placeholder="Search here ..." variant="bordered" startContent={<BiSearch />} />
        <Button
          color="success"
          variant="bordered"
          className="md:w-[200px]"
          startContent={<CiCirclePlus className="text-2xl" />}
          onPress={addNewButtonClick}
          isIconOnly
        >
          <span className="hidden md:block ml-2">Add new</span>
        </Button>
        {showEditMode && (
          <Button
            color={editMode ? "danger" : "primary"}
            variant="bordered"
            className="md:w-[200px]"
            onPress={() => setEditMode(!editMode)}
            isIconOnly
          >
            {!editMode ? <BiEdit className="text-2xl" /> : <CgClose className="text-2xl" />}{" "}
            <span className="hidden md:block ml-2"> {!editMode ? "Edit Mode" : "Close Edit"}</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default PageTopContent;
