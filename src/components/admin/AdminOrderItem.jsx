import React, { useState } from "react";
import { Accordion, AccordionItem, Chip, Image, Divider, Select, SelectItem, addToast, Spinner } from "@heroui/react";
import dayjs from "dayjs";
import orderService from "../../api-services/orderService";
import {
  FaMoneyBillWave,
  FaTruck,
  FaMapMarkerAlt,
  FaHome,
  FaBuilding,
  FaPhone,
} from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { getStatusColor } from "../../utils/order_status_colors";

function AdminOrderItem({ order, setOrders, availableOrderStatus }) {
  const [isUpdating, setIsUpdating] = useState(false);

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

  const formatDateTimeLong = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("dddd, D MMM YYYY [at] h.mm A");
  };

  const getDeliveryDateColor = (dateString) => {
    if (!dateString) return "text-gray-500 dark:text-gray-400";
    const date = new Date(dateString);
    const now = new Date();
    
    // Compare full datetime
    if (date.getTime() < now.getTime()) {
      return "text-red-500 dark:text-red-400";
    } else {
      // Check if it's today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const compareDate = new Date(date);
      compareDate.setHours(0, 0, 0, 0);
      
      if (compareDate.getTime() === today.getTime()) {
        return "text-orange-500 dark:text-orange-400";
      } else {
        return "text-green-500 dark:text-green-400";
      }
    }
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

  const handleStatusUpdate = async (newStatus) => {
    if (!newStatus || newStatus === order?.orderStatus) return;

    setIsUpdating(true);
    try {
      const response = await orderService.updateOrderStatusByAdmin({
        orderId: order?.id,
        orderStatus: newStatus,
      });

      if (response.status === 200 && response.data.status) {
        // Update the order in the orders list
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.orderID === order.orderID
              ? { ...o, orderStatus: newStatus }
              : o
          )
        );
        addToast({
          title: "Status updated",
          description: `Order status changed to ${newStatus.replace(/_/g, " ")}`,
          color: "success",
        });
      } else {
        addToast({
          title: "Update failed",
          description: response.data?.message || "Could not update order status",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: error?.message || "Something went wrong",
        color: "danger",
      });
    } finally {
      setIsUpdating(false);
    }
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
                Delivery: <span className={`font-medium ${getDeliveryDateColor(order?.deliveryScheduledAt)}`}>{formatDateTimeLong(order?.deliveryScheduledAt)}</span>
              </span>
            </div>
            <Chip
              color={getStatusColor(order?.orderStatus)}
              variant="flat"
              size="sm"
              className="capitalize"
            >
              {order?.orderStatus?.replace(/_/g, " ") || "Pending"}
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

            {/* Contact and Address */}
            {(order?.phone || order?.address) && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                  <FaMapMarkerAlt className="text-red-500 text-xs" />
                  Contact and Address
                </h3>
                <div className="text-xs space-y-1">
                  {/* Phone */}
                  {order?.phone && (
                    <div className="mb-3">
                      <div className="flex items-center gap-1">
                        <FaPhone className="text-blue-500 text-xs" />
                        <span className="font-semibold">Phone</span>
                      </div>
                      <div className="ml-5 text-gray-600 dark:text-gray-400">
                        <a 
                          href={`tel:${order.phone}`}
                          className="truncate text-gray-600 dark:text-gray-400 hover:underline"
                        >
                          {order.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {/* Address */}
                  {order?.address && (
                    <div>
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
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <Divider className="my-4" />
        <div className="flex justify-end items-center gap-2">
          {availableOrderStatus && availableOrderStatus.length > 0 ? (
            <Select
              size="sm"
              label="Update Status"
              placeholder="Select new status"
              selectedKeys={new Set([order?.orderStatus])}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                if (selected) {
                  handleStatusUpdate(selected);
                }
              }}
              variant="bordered"
              isDisabled={isUpdating}
              className="min-w-[200px]"
              startContent={isUpdating ? <Spinner size="sm" /> : null}
              classNames={{
                value: "capitalize",
              }}
            >
              <SelectItem key={order?.orderStatus} value={order?.orderStatus} className="capitalize">
                {order?.orderStatus?.replace(/_/g, " ") || "Current"}
              </SelectItem>
              {availableOrderStatus.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </Select>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              No status updates available
            </span>
          )}
        </div>
      </AccordionItem>
    </Accordion>
  );
}

export default AdminOrderItem;
