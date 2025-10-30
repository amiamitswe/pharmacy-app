import React, { useEffect, useState } from "react";
import CompanyList from "../../components/admin/CompanyList";
import PageTopContent from "../../components/common/PageTopContent";
import { addToast, Card, useDisclosure } from "@heroui/react";
import { useAtom } from "jotai";
import CustomModal from "../../components/common/modal/CustomModal";
import MedicineTypeList from "../../components/admin/MedicineTypeList";
import { medicineTypeAtom } from "../../atoms/medicineTypeAtom";
import { medicineTypeService } from "../../api-services";
import AddNewMedicineType from "../../components/admin/modal/AddNewMedicineType";

function AdminMedicineType() {
  const [editMode, setEditMode] = useState(false);
  const [medicineTypeState, setMedicineTypeState] = useAtom(medicineTypeAtom);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const getAllMedicineTypes = async () => {
      try {
        const response = await medicineTypeService.getList();

        if (response.status === 200) {
          setMedicineTypeState({
            medicineTypes: response?.data?.result || [],
            loading: false,
            error: null,
            count: response?.data?.dataCount || 0,
          });
        }
      } catch (error) {
        addToast({
          title: error.data.message || "Unable to fetch medicine types",
          color: "danger",
        });
      }
    };

    getAllMedicineTypes();
  }, []);

  return (
    <>
      <PageTopContent
        title="Medicine Type"
        count={medicineTypeState?.count}
        showEditMode
        editMode={editMode}
        setEditMode={setEditMode}
        addNewButtonClick={onOpen}
      />
      <MedicineTypeList editMode={editMode} />

      <CustomModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Add New Medicine Type"
        isDismissable={false}
      >
        <AddNewMedicineType closeModal={onOpenChange} />
      </CustomModal>
    </>
  );
}

export default AdminMedicineType;
