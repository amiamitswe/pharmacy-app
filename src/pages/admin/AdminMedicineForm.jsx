import React, { useEffect, useState } from "react";
import CompanyList from "../../components/admin/CompanyList";
import PageTopContent from "../../components/common/PageTopContent";
import { addToast, Card, useDisclosure } from "@heroui/react";
import { useAtom } from "jotai";
import CustomModal from "../../components/common/modal/CustomModal";
import MedicineFormList from "../../components/admin/MedicineFormList";
import { medicineFormAtom } from "../../atoms/medicineFormAtom";
import { medicineFormService } from "../../api-services";
import AddNewMedicineForm from "../../components/admin/modal/AddNewMedicineForm";

function AdminMedicineForm() {
  const [editMode, setEditMode] = useState(false);
  const [medicineTypeState, setMedicineTypeState] = useAtom(medicineFormAtom);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const getAllMedicineTypes = async () => {
      try {
        const response = await medicineFormService.getList();

        if (response.status === 200) {
          setMedicineTypeState({
            medicineForms: response?.data?.result || [],
            loading: false,
            error: null,
            count: response?.data?.dataCount || 0,
          });
        }
      } catch (error) {
        addToast({
          title: error.data.message || "Unable to fetch medicine forms",
          color: "danger",
        });
      }
    };

    getAllMedicineTypes();
  }, []);

  return (
    <>
      <PageTopContent
        title="Medicine Forms"
        count={medicineTypeState?.count}
        showEditMode
        editMode={editMode}
        setEditMode={setEditMode}
        addNewButtonClick={onOpen}
      />
      <MedicineFormList editMode={editMode} />

      <CustomModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Add New Medicine Form"
        isDismissable={false}
      >
        <AddNewMedicineForm closeModal={onOpenChange} />
      </CustomModal>
    </>
  );
}

export default AdminMedicineForm;
