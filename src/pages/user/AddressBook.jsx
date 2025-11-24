import React from "react";
import UserAddress from "../../components/user/user-address/UserAddress";
import { Card, CardBody, Spinner } from "@heroui/react";
import { useAtomValue } from "jotai";
import { addressLoadingAtom } from "../../atoms/authAtom";

function AddressBook() {
  const addressLoading = useAtomValue(addressLoadingAtom);
  return (
    <Card shadow="sm" className="bg-gray-50 dark:bg-gray-900">
      <CardBody>
        {addressLoading && (
          <div className="flex justify-center items-center flex-col h-[100px]">
            <Spinner color="primary" />
            <p className="text-xs">Loading address...</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <UserAddress />
        </div>
      </CardBody>
    </Card>
  );
}

export default AddressBook;
