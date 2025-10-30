import React, { useEffect, useState } from "react";
import PageTopContent from "../../components/common/PageTopContent";
import CustomModal from "../../components/common/modal/CustomModal";
import { useAtom } from "jotai";
import { addToast, useDisclosure } from "@heroui/react";
import { userService } from "../../api-services";
import { usersAtom } from "../../atoms";
import UsersList from "../../components/admin/UsersList";

function AdminUsers() {
  const [editMode, setEditMode] = useState(false);
  const [usersState, setUsersState] = useAtom(usersAtom);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const getAllUsers = async () => {
      setUsersState({
        loading: true,
      });
      try {
        const response = await userService.getAllUsers({
          role: "user",
          page: 1,
          limit: 10,
        });

        if (response.status === 200) {
          setUsersState({
            users: response?.data?.result || [],
            loading: false,
            error: null,
            count: response?.data?.count || 0,
          });
        }
      } catch (error) {
        addToast({
          title: error.data.message || "Unable to fetch generics",
          color: "danger",
        });
      } finally {
        setUsersState((pre) => ({
          ...pre,
          loading: false,
        }));
      }
    };

    getAllUsers();
  }, []);

  return (
    <>
      <PageTopContent
        title="All Users"
        count={usersState?.count}
        showEditMode
        editMode={editMode}
        setEditMode={setEditMode}
        addNewButtonClick={onOpen}
      />
      <UsersList editMode={editMode} />

      <CustomModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Add New User"
        isDismissable={false}
      >
        <p>Not available right now</p>
        {/* <AddNewGeneric closeModal={onOpenChange} /> */}
      </CustomModal>
    </>
  );
}

export default AdminUsers;
