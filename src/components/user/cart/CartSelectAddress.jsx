import { Select, SelectItem } from "@heroui/react";
import React from "react";

function CartSelectAddress({
  selectedAddressId,
  setSelectedAddressId,
  addresses,
}) {

    // Format address for display
    const formatAddress = (addr) => {
      const parts = [
        addr.street,
        addr.location,
        addr.city,
        addr.zipCode,
        addr.country,
      ].filter(Boolean);
      const addressString = parts.join(", ");
      return `${addr.addressType || "Address"}${
        addressString ? ` - ${addressString}` : ""
      }${addr.isDefault ? " (Default)" : ""}`;
    };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Select Delivery Address
      </label>
      <Select
        variant="bordered"
        selectedKeys={
          selectedAddressId ? new Set([String(selectedAddressId)]) : new Set()
        }
        onSelectionChange={(keys) => {
          const first = Array.from(keys)[0];
          if (first != null) {
            setSelectedAddressId(first);
          }
        }}
        size="lg"
        placeholder="Select an address"
        className="w-full"
        classNames={{
          trigger: "border-1 border-gray-200 dark:border-gray-700",
        }}
      >
        {addresses.map((addr) => (
          <SelectItem key={String(addr._id)}>{formatAddress(addr)}</SelectItem>
        ))}
      </Select>
    </div>
  );
}

export default CartSelectAddress;
