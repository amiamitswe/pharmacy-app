import { addToast, Card, useDisclosure } from "@heroui/react";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { medicineAtom } from "../../atoms/medicineAtom";
import PageTopContent from "../../components/common/PageTopContent";
import CustomModal from "../../components/common/modal/CustomModal";
import medicineService from "../../api-services/medicineService";
import MedicineList from "../../components/admin/MedineList";
import PaginationComponent from "../../components/common/PaginationComponent";

function AdminMedicines() {
  const [editMode, setEditMode] = useState(false);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [medicineState, setMedicines] = useAtom(medicineAtom);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const getAllMedicines = async () => {
      try {
        const response = await medicineService.getList(currentPage, limit);

        if (response.status === 200) {
          setMedicines({
            medicines: response?.data?.result || [],
            loading: false,
            error: null,
            count: response?.data?.total || 0,
          });
        }
      } catch (error) {
        addToast({
          title: error.data.message || "Unable to fetch medicines",
          color: "danger",
        });
      }
    };

    getAllMedicines();
  }, [currentPage, limit]);

  return (
    <>
      <PageTopContent
        title="Medicines"
        count={medicineState?.count}
        showEditMode
        editMode={editMode}
        setEditMode={setEditMode}
        addNewButtonClick={onOpen}
      />
      <Card className="p-4 bg-slate-50 dark:bg-slate-900" shadow="sm">
        <MedicineList editMode={editMode} />
        {medicineState?.count > 0 ? (
          <PaginationComponent
            currentPage={currentPage}
            total={Math.ceil(medicineState?.count / limit)}
            onChange={setCurrentPage}
            limit={limit}
            setLimit={setLimit}
            showControls
          />
        ) : null}
      </Card>

      <CustomModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Add New Company"
        isDismissable={false}
      >
        {/* <AddNewCompanyModal closeModal={onOpenChange} /> */}
        <p>Coming soon...</p>
      </CustomModal>
    </>
  );
}

export default AdminMedicines;
