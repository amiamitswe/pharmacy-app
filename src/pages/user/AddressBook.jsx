import React, { useCallback, useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Spinner } from "@heroui/react";
import AddNewAddressModal from "../../components/user/user-address/AddNewAddressModal";
import userService from "../../api-services/userService";
import SingleAddress from "../../components/user/user-address/SingleAddress";

function AddressBook() {
  const [addressLoading, setAddressLoading] = useState(false);
  const [address, setAddress] = useState([]);

  const fetchAddress = useCallback(async () => {
    try {
      setAddressLoading(true);
      const response = await userService.getUserAddress();
      if (response.status === 200) {
        setAddress(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAddressLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  return (
    <Card shadow="sm" className="bg-gray-50 dark:bg-gray-900">
      <CardHeader className="justify-end">
        <AddNewAddressModal fetchAddress={fetchAddress} />
      </CardHeader>
      <CardBody>
        {addressLoading ? (
          <div className="flex justify-center items-center flex-col h-[100px]">
            <Spinner color="primary" />
            <p className="text-xs">Loading address...</p>
          </div>
        ) : address?.count > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {address?.address?.map((add) => (
              <SingleAddress
                key={add._id}
                add={add}
                fetchAddress={fetchAddress}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-16">
            No addresses found. <br /> Please add an address first.
          </p>
        )}
      </CardBody>
    </Card>
  );
}

export default AddressBook;
