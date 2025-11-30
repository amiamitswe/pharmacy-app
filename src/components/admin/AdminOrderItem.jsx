import React from "react";
import { Accordion, AccordionItem, Chip, Image, Divider } from "@heroui/react";
import {
  FaMoneyBillWave,
  FaTruck,
  FaMapMarkerAlt,
  FaHome,
  FaBuilding,
} from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";

function AdminOrderItem({ order }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower?.includes("pending")) {
      return "warning";
    }
    if (
      statusLower?.includes("delivered") ||
      statusLower?.includes("completed")
    ) {
      return "success";
    }
    if (statusLower?.includes("cancelled") || statusLower?.includes("failed")) {
      return "danger";
    }
    if (
      statusLower?.includes("processing") ||
      statusLower?.includes("shipped")
    ) {
      return "primary";
    }
    return "default";
  };

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
    <Accordion
      itemClasses={{
        base: "bg-slate-50 dark:bg-slate-900 border-1 border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200",
        title: "text-base font-semibold",
        trigger:
          "px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200 data-[hover=true]:bg-slate-100 dark:data-[hover=true]:bg-slate-800",
        content: "px-4 pb-4",
        indicator: "text-gray-600 dark:text-gray-400",
      }}
    >
      <AccordionItem
        key={order?.orderID}
        aria-label={`Order ${order?.orderID}`}
        classNames={{
          trigger:
            "px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200 data-[hover=true]:bg-slate-100 dark:data-[hover=true]:bg-slate-800 hover:cursor-pointer cursor-pointer",
        }}
        title={
          <div className="flex justify-between items-center w-full flex-wrap gap-2">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-bold">Order #{order?.orderID}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Placed: {formatDateShort(order?.createdAt)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Delivery: {formatDateShort(order?.deliveryScheduledAt)}
              </span>
            </div>
            <Chip
              color={getStatusColor(order?.orderStatus)}
              variant="flat"
              size="sm"
              className="capitalize"
            >
              {order?.orderStatus?.replace("_", " ") || "Pending"}
            </Chip>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Order Items Section */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
              Order Items ({order?.orderItems?.length || 0})
            </h3>
            <div className="flex flex-col gap-3">
              {order?.orderItems?.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150"
                >
                  <Image
                    src={item?.medicineId?.picUrl}
                    alt={item?.medicineId?.medicineName}
                    className="w-16 h-16 object-cover rounded-lg shrink-0 border border-gray-200 dark:border-gray-700"
                    fallbackSrc="https://amit-pharmacy-app.s3.eu-north-1.amazonaws.com/uploads/1763148065525-not-found.jpg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {item?.medicineId?.medicineName}
                    </p>
                    <div className="flex justify-between items-center mt-1 flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span>Qty: {item?.quantity}</span>
                        <span>•</span>
                        <span className="line-through">
                          {item?.price?.toFixed(2)} BDT
                        </span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {item?.discountPrice?.toFixed(2)} BDT
                        </span>
                      </div>
                      <p className="text-sm font-bold">
                        {item?.totalItemPrice?.toFixed(2)} BDT
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider - Horizontal on mobile, vertical on desktop */}
          <Divider className="lg:hidden my-2" />

          {/* Order Summary & Address */}
          <div className="flex flex-col gap-3 lg:border-l lg:border-gray-300 dark:lg:border-gray-700 lg:pl-4">
            {/* Order Summary */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <FaMoneyBillWave className="text-teal-500 text-sm" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Payment:
                  </span>
                  <span className="font-semibold capitalize">
                    {order?.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : order?.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTruck className="text-green-500 text-sm" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Delivery:
                  </span>
                  <span className="font-semibold text-xs">
                    {formatDate(order?.deliveryScheduledAt)}
                  </span>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                    {order?.totalPrice?.toFixed(2)} BDT
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            {order?.address && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                  <FaMapMarkerAlt className="text-red-500 text-xs" />
                  Address
                </h3>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-1">
                    {getAddressTypeIcon(order.address.addressType)}
                    <span className="font-semibold capitalize">
                      {order.address.addressType}
                    </span>
                  </div>
                  <div className="ml-5 text-gray-600 dark:text-gray-400">
                    {order.address.street && (
                      <p className="truncate">{order.address.street}</p>
                    )}
                    <p className="truncate">
                      {[
                        order.address.location,
                        order.address.city,
                        order.address.zipCode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {order.address.country && (
                      <p className="truncate">{order.address.country}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  );
}

export default AdminOrderItem;
