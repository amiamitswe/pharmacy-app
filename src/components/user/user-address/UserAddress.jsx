import React, { useEffect, useState, useCallback } from "react";
import userService from "../../../api-services/userService";
import AddNewAddressModal from "./AddNewAddressModal";
import { Link } from "react-router";
import { Button, Spinner } from "@heroui/react";
import SingleAddress from "./SingleAddress";

function UserAddress() {
  const [address, setAddress] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);

  const fetchAddress = useCallback(async () => {
    try {
      setAddressLoading(true);
      const response = await userService.getUserAddress({
        onlyDefault: true,
      });
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
    <>
      {addressLoading ? (
        <div className="flex justify-center items-center flex-col h-[100px]">
          <Spinner color="primary" />
          <p className="text-xs">Loading address...</p>
        </div>
      ) : (
        <>
          {address?.address?.length > 0 ? (
            address?.address?.map((add) => (
              <SingleAddress
                key={add._id}
                add={add}
                fetchAddress={fetchAddress}
              />
            ))
          ) : address?.count > 0 && address?.address?.length === 0 ? (
            <div className="flex justify-center items-center flex-col h-[140px] col-span-full">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                No Default addresses found. <br /> Please Select default address
                first.
              </p>

              <Button as={Link} to="/user/address-book" className="mt-4">
                Set Default Address
              </Button>
            </div>
          ) : (
            <div className="flex justify-center items-center flex-col h-[140px] col-span-full">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                No addresses found. <br /> Please add an address first.
              </p>
              <AddNewAddressModal fetchAddress={fetchAddress} />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default UserAddress;
