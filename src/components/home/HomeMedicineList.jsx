import { addToast, Spinner } from "@heroui/react";
import medicineService from "../../api-services/medicineService";
import MedicineItem from "../common/medicine/MedicineItem";
import { useEffect, useState } from "react";

function HomeMedicineList() {
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchMedicineData = async () => {
      setLoading(true);
      try {
        const response = await medicineService.getList({ limit: 10 });
        if (response.status === 200) {
          setMedicines(response.data.result);
          setLoading(false);
        }
      } catch (error) {
        addToast({
          title: error.data.message || "Unable to fetch medicines",
          color: "danger",
        });
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicineData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {medicines?.length > 0 ? (
        <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 mt-10">
          {medicines?.map((item) => (
            <MedicineItem key={item._id} data={item} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p className="text-center text-gray-500 dark:text-gray-400">
            No medicines found
          </p>
        </div>
      )}
    </div>
  );
}

export default HomeMedicineList;
