import React from "react";
import UserAddress from "../../components/user/user-address/UserAddress";
import { Card, CardBody } from "@heroui/react";

function AddressBook() {
  return (
    <Card shadow="sm" className="bg-gray-50 dark:bg-gray-900">
      <CardBody>
        <div className="grid grid-cols-2 gap-4">
          <UserAddress />
        </div>
      </CardBody>
    </Card>
  );
}

export default AddressBook;
