import React, { useEffect, useState } from "react";
import userService from "../../../api-services/userService";
import { FaHome, FaBuilding, FaMapMarkerAlt } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { addressLoadingAtom } from "../../../atoms/authAtom";
import { useSetAtom } from "jotai";

function UserAddress({ onlyDefault = false, id }) {
  const [address, setAddress] = useState([]);
  const setAddressLoading = useSetAtom(addressLoadingAtom);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setAddressLoading(true);
        const response = await userService.getUserAddress({
          onlyDefault,
          id,
        });
        if (response.status === 200) {
          setAddress(response.data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setAddressLoading(false);
      }
    };

    fetchAddress();
  }, [onlyDefault, id, setAddressLoading]);

  const getAddressTypeIcon = (type) => {
    const typeLower = type?.toLowerCase() || "";
    if (typeLower.includes("home")) {
      return <FaHome className="text-blue-600 dark:text-blue-400" />;
    } else if (typeLower.includes("office") || typeLower.includes("work")) {
      return <FaBuilding className="text-purple-600 dark:text-purple-400" />;
    }
    return <HiLocationMarker className="text-gray-600 dark:text-gray-400" />;
  };

  return (
    <>
      {address?.address?.length > 0 ? (
        address?.address?.map((add) => (
          <div
            key={add?._id}
            className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
          >
            {/* Header with Address Type and Default Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="text-xl">
                  {getAddressTypeIcon(add?.addressType)}
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 capitalize">
                  {add?.addressType || "Address"}
                </h3>
              </div>
              {add?.isDefault && (
                <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  Default
                </span>
              )}
            </div>

            {/* Address Details */}
            <div className="space-y-1 text-gray-600 dark:text-gray-300">
              {add?.street && (
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="text-gray-400 dark:text-gray-500 mt-1 text-sm shrink-0" />
                  <p className="text-sm">{add.street}</p>
                </div>
              )}
              <div className="flex items-start gap-2">
                <span className="text-gray-400 dark:text-gray-500 mt-1 text-sm">
                  📍
                </span>
                <p className="text-sm">
                  {[add?.location, add?.city, add?.zipCode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              {add?.country && <p className="text-sm ml-6">{add.country}</p>}
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center flex-col h-[100px] col-span-full">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            No addresses found. <br /> Please add an address first.
          </p>

          
        </div>
      )}
    </>
  );
}

export default UserAddress;
