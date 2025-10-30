import { useEffect, useState } from "react";
import PageTopContent from "../../components/common/PageTopContent";
import { addToast, useDisclosure } from "@heroui/react";
import { useAtom } from "jotai";
import CustomModal from "../../components/common/modal/CustomModal";
import MCategoryList from "../../components/admin/MCategoryList";
import { mCategoryAtom } from "../../atoms/mCategoryAtom";
import mCategoryService from "../../api-services/mCategoryService";
import AddNewCategory from "../../components/admin/modal/AddNewCategory";

function AdminMedicineCategory() {
  const [editMode, setEditMode] = useState(false);
  const [mCategoryState, setMCategoryState] = useAtom(mCategoryAtom);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const response = await mCategoryService.getList();

        if (response.status === 200) {
          setMCategoryState({
            categories: response?.data?.result || [],
            loading: false,
            error: null,
            count: response?.data?.dataCount || 0,
          });
        }
      } catch (error) {
        addToast({
          title: error.data.message || "Unable to fetch companies",
          color: "danger",
        });
      }
    };

    getAllCategories();
  }, []);

  return (
    <>
      <PageTopContent
        title="Category"
        count={mCategoryState?.count}
        showEditMode
        editMode={editMode}
        setEditMode={setEditMode}
        addNewButtonClick={onOpen}
      />
      <MCategoryList editMode={editMode} />

      <CustomModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Add New Category"
        isDismissable={false}
      >
        <AddNewCategory closeModal={onOpenChange} />
      </CustomModal>
    </>
  );
}

export default AdminMedicineCategory;
