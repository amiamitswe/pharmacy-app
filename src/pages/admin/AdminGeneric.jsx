import React, { useEffect, useState } from "react";
import PageTopContent from "../../components/common/PageTopContent";
import CustomModal from "../../components/common/modal/CustomModal";
import { useAtom } from "jotai";
import { addToast, useDisclosure } from "@heroui/react";
import { medicineGenericAtom } from "../../atoms/medicineGenericAtom";
import MedicineGenericList from "../../components/admin/MedicineGenericList";
import { medicineGenericService } from "../../api-services";
import AddNewGeneric from "../../components/admin/modal/AddNewGeneric";

function AdminGeneric() {
  const [editMode, setEditMode] = useState(false);
  const [mGenericState, setMGenericState] = useAtom(medicineGenericAtom);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const getAllGenerics = async () => {
      setMGenericState({
        loading: true,
      });
      try {
        const response = await medicineGenericService.getList();

        if (response.status === 200) {
          setMGenericState({
            generics: response?.data?.result || [],
            loading: false,
            error: null,
            count: response?.data?.dataCount || 0,
          });
        }
      } catch (error) {
        addToast({
          title: error.data.message || "Unable to fetch generics",
          color: "danger",
        });
      } finally {
        setMGenericState((pre) => ({
          ...pre,
          loading: false,
        }));
      }
    };

    getAllGenerics();
  }, []);

  return (
    <>
      <PageTopContent
        title="Medicine Generic"
        count={mGenericState?.count}
        showEditMode
        editMode={editMode}
        setEditMode={setEditMode}
        addNewButtonClick={onOpen}
      />
      <MedicineGenericList editMode={editMode} />

      <CustomModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Add New Medicine Generic"
        isDismissable={false}
      >
        <AddNewGeneric closeModal={onOpenChange} />
      </CustomModal>
    </>
  );
}

export default AdminGeneric;
