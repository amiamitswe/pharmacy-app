import { addToast, Card } from "@heroui/react";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { medicineAtom } from "../../atoms/medicineAtom";
import PageTopContent from "../../components/common/PageTopContent";
import medicineService from "../../api-services/medicineService";
import MedicineList from "../../components/admin/MedicineList";
import PaginationComponent from "../../components/common/PaginationComponent";
import { useNavigate } from "react-router";
import { useDebounce } from "../../hooks/useDebounce";

function AdminMedicines() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [medicineState, setMedicines] = useAtom(medicineAtom);

  const debouncedQuery = useDebounce(search, 1000);

  useEffect(() => {
    const getAllMedicines = async () => {
      setMedicines({
        loading: true,
      });
      try {
        const response = await medicineService.getList(
          currentPage,
          limit,
          debouncedQuery.toLowerCase()
        );

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
      } finally {
        setMedicines((pre) => ({
          ...pre,
          loading: false,
        }));
      }
    };

    getAllMedicines();
  }, [currentPage, limit, debouncedQuery]);

  return (
    <>
      <PageTopContent
        title="Medicines"
        count={medicineState?.count}
        showEditMode
        editMode={editMode}
        setEditMode={setEditMode}
        addNewButtonClick={() => navigate("add_new")}
        search={search}
        setSearch={setSearch}
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
    </>
  );
}

export default AdminMedicines;
