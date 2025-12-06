import React, { useEffect, useState } from "react";
import { orderService } from "../../api-services";
import { useParams, Link } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
  Image,
  Divider,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBox,
  FaTruck,
  FaMapMarkerAlt,
  FaHome,
  FaBuilding,
  FaPhone,
  FaClipboardList,
  FaHistory,
  FaClock,
  FaChevronDown,
} from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { getStatusColor } from "../../utils/order_status_colors";

function UserOrderDetails() {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderById(id);
        if (response.status === 200) {
          setOrderData(response.data.data || response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-col h-[400px]">
        <Spinner color="primary" size="lg" />
        <p className="text-sm mt-4 text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <p className="text-lg font-semibold text-gray-500">Order not found</p>
        <Link to="/user/orders" className="mt-4 text-primary hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Back Button */}
      <Link
        to="/user/orders"
        className="text-primary hover:underline text-sm flex items-center gap-2"
      >
        ← Back to Orders
      </Link>

      {/* Order Header */}
      <Card shadow="sm" className="bg-gray-50 dark:bg-gray-900">
        <CardHeader className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">Order #{orderData.orderID}</h1>
            <p className="text-sm text-gray-500">
              Placed on {formatDate(orderData.createdAt)}
            </p>
          </div>
          <Chip
            color={getStatusColor(orderData.orderStatus)}
            variant="flat"
            size="lg"
            className="capitalize"
          >
            {orderData.orderStatus?.replace(/_/g, " ") || "Pending"}
          </Chip>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Order Items */}
          <Card shadow="sm" className="bg-gray-50 dark:bg-gray-900">
            <CardHeader>
              <p className="text-lg font-semibold flex items-center gap-2">
                <FaBox className="text-blue-500" />
                Order Items ({orderData.orderItems?.length || 0})
              </p>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-4">
                {orderData.orderItems?.map((item, index) => (
                  <div key={index}>
                    <div className="flex gap-4">
                      {/* Medicine Image */}
                      <div className="shrink-0">
                        <Image
                          src={item.medicineId?.picUrl}
                          alt={item.medicineId?.medicineName}
                          className="w-24 h-24 object-cover rounded-lg"
                          fallbackSrc="https://amit-pharmacy-app.s3.eu-north-1.amazonaws.com/uploads/1763148065525-not-found.jpg"
                        />
                      </div>

                      {/* Medicine Details */}
                      <div className="flex-1 flex flex-col gap-2">
                        <div>
                          <Link
                            to={`/medicine/${item.medicineId?._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-semibold hover:text-primary transition-colors cursor-pointer"
                          >
                            {item.medicineId?.medicineName}
                          </Link>
                          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {item.medicineId?.generics_and_strengths
                              ?.map((g) => g.generic.genericName)
                              .join(" + ")}{" "}
                            -{" "}
                            {item.medicineId?.generics_and_strengths
                              ?.map((g) => g.strength)
                              .join(" + ")}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.medicineId?.company?.company} •{" "}
                            {item.medicineId?.medicine_form?.medicineForm} •{" "}
                            {item.medicineId?.unitInfo}
                          </p>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex flex-col gap-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Quantity: <span className="font-semibold">{item.quantity}</span>
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-sm line-through text-gray-500">
                                {item.price?.toFixed(2)} Taka
                              </span>
                              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                {item.discountPrice?.toFixed(2)} Taka
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Item Total</p>
                            <p className="text-lg font-bold">
                              {item.totalItemPrice?.toFixed(2)} Taka
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < orderData.orderItems.length - 1 && (
                      <Divider className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column - Order Summary & Address */}
        <div className="flex flex-col gap-4">
          {/* Order Summary */}
          <Card shadow="sm" className="bg-gray-50 dark:bg-gray-900">
            <CardHeader>
              <p className="text-lg font-semibold flex items-center gap-2">
                <FaClipboardList className="text-blue-500" />
                Order Summary
              </p>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-4">
                {/* Payment Method */}
                <div className="flex items-center gap-3">
                  <FaMoneyBillWave className="text-teal-500 text-xl" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="text-sm font-semibold capitalize">
                      {orderData.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : orderData.paymentMethod}
                    </p>
                  </div>
                </div>

                <Divider />

                {/* Delivery Date */}
                <div className="flex items-center gap-3">
                  <FaTruck className="text-green-500 text-xl" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Delivery Scheduled</p>
                    <p className="text-sm font-semibold">
                      {formatDate(orderData.deliveryScheduledAt)}
                    </p>
                  </div>
                </div>

                <Divider />

                {/* Order Date */}
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-purple-500 text-xl" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Order Date</p>
                    <p className="text-sm font-semibold">
                      {formatDate(orderData.createdAt)}
                    </p>
                  </div>
                </div>

                <Divider />

                {/* Total Price */}
                <div className="flex justify-between items-center pt-2">
                  <p className="text-lg font-semibold">Total Amount</p>
                  <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {orderData.totalPrice?.toFixed(2)} Taka
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Contact and Shipping Address */}
          <Card shadow="sm" className="bg-gray-50 dark:bg-gray-900">
            <CardHeader>
              <p className="text-lg font-semibold flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />
                Contact and Shipping Address
              </p>
            </CardHeader>
            <CardBody>
              {orderData.address ? (
                <div className="flex flex-col gap-3">
                  {orderData.phone && (
                    <div className="flex items-center gap-2">
                      <div className="text-xl">
                        <FaPhone className="text-gray-600 dark:text-gray-400" />
                      </div>
                      <p className="font-semibold text-base text-gray-800 dark:text-gray-200">
                        {orderData.phone}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <div className="text-xl">
                      {getAddressTypeIcon(orderData.address.addressType)}
                    </div>
                    <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200 capitalize">
                      {orderData.address.addressType || "Address"}
                    </h3>
                  </div>

                  <div className="space-y-1 text-gray-600 dark:text-gray-300 ml-8">
                    {orderData.address.street && (
                      <p className="text-sm">{orderData.address.street}</p>
                    )}
                    <p className="text-sm">
                      {[
                        orderData.address.location,
                        orderData.address.city,
                        orderData.address.zipCode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {orderData.address.country && (
                      <p className="text-sm">{orderData.address.country}</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No address available</p>
              )}
            </CardBody>
          </Card>

          {/* Order Activity Timeline */}
          <Card shadow="sm" className="bg-gray-50 dark:bg-gray-900">
            <CardHeader>
              <div
                className="flex items-center justify-between w-full cursor-pointer"
                onClick={() => setIsTimelineOpen(!isTimelineOpen)}
              >
                <p className="text-lg font-semibold flex items-center gap-2">
                  <FaHistory className="text-indigo-500" />
                  Order Activity Timeline
                </p>
                <FaChevronDown
                  className={`text-gray-500 transition-transform duration-200 ${
                    isTimelineOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
            {isTimelineOpen && (
              <CardBody className="pt-0">
                <Accordion
                  selectedKeys={
                    isTimelineOpen ? new Set(["activity-timeline"]) : new Set()
                  }
                  onSelectionChange={(keys) =>
                    setIsTimelineOpen(keys.has("activity-timeline"))
                  }
                  className="bg-transparent"
                  itemClasses={{
                    base: "bg-transparent",
                    title: "hidden",
                    trigger: "hidden",
                    content: "px-0 pb-2",
                  }}
                >
                <AccordionItem
                  key="activity-timeline"
                  aria-label="View Activity Timeline"
                  title=""
                >
                  {orderData?.timeAccordingOrderStatus &&
                  orderData.timeAccordingOrderStatus.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {(() => {
                        const reversedActivities = [
                          ...orderData.timeAccordingOrderStatus,
                        ].reverse();
                        return reversedActivities.map((activity, index) => (
                          <div key={activity._id || index}>
                            <div className="flex items-start gap-3">
                              {/* Timeline dot */}
                              <div className="flex flex-col items-center mt-1">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    index === 0
                                      ? "bg-indigo-500"
                                      : "bg-gray-400 dark:bg-gray-600"
                                  }`}
                                />
                                {index < reversedActivities.length - 1 && (
                                  <div className="w-0.5 h-full min-h-[40px] bg-gray-300 dark:bg-gray-700 mt-1" />
                                )}
                              </div>

                              {/* Activity content */}
                              <div className="flex-1 pb-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <Chip
                                    color={getStatusColor(activity.status)}
                                    variant="flat"
                                    size="sm"
                                    className="capitalize"
                                  >
                                    {activity.status?.replace(/_/g, " ") ||
                                      "Unknown"}
                                  </Chip>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                  <FaClock className="text-gray-400" />
                                  <span>{formatDate(activity.time)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No activity history available
                    </p>
                  )}
                </AccordionItem>
              </Accordion>
              </CardBody>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default UserOrderDetails;
