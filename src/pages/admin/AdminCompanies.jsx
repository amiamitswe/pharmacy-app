import React, { useEffect, useState } from "react";
import CompanyList from "../../components/admin/CompanyList";
import PageTopContent from "../../components/common/PageTopContent";
import { addToast, Card, useDisclosure } from "@heroui/react";
import companyService from "../../api-services/companyService";
import { useAtom } from "jotai";
import { companyAtom } from "../../atoms/companyAtom";
import CustomModal from "../../components/common/modal/CustomModal";
import AddNewCompanyModal from "../../components/admin/modal/AddNewCompanyModal";

function AdminCompanies() {
  const [editMode, setEditMode] = useState(false);
  const [companyState, setCompanies] = useAtom(companyAtom);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const getAllCompanies = async () => {
      try {
        const response = await companyService.getList();

        if (response.status === 200) {
          setCompanies({
            companies: response?.data?.result || [],
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

    getAllCompanies();
  }, []);

  return (
    <>
      <Card className="p-4" shadow="sm">
        <PageTopContent
          title="Companies"
          count={companyState?.count}
          showEditMode
          editMode={editMode}
          setEditMode={setEditMode}
          addNewButtonClick={onOpen}
        />
        <CompanyList editMode={editMode} />
      </Card>

      <CustomModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Add New Company"
        isDismissable={false}
      >
        <AddNewCompanyModal closeModal={onOpenChange} />
      </CustomModal>
    </>
  );
}

export default AdminCompanies;
