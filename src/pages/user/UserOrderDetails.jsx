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
} from "@heroui/react";
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBox,
  FaTruck,
  FaMapMarkerAlt,
  FaHome,
  FaBuilding,
} from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";

function UserOrderDetails() {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower?.includes("pending")) {
      return "warning";
    }
    if (statusLower?.includes("delivered") || statusLower?.includes("completed")) {
      return "success";
    }
    if (statusLower?.includes("cancelled") || statusLower?.includes("failed")) {
      return "danger";
    }
    if (statusLower?.includes("processing") || statusLower?.includes("shipped")) {
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
            {orderData.orderStatus?.replace("_", " ") || "Pending"}
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
              <p className="text-lg font-semibold">Order Summary</p>
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

          {/* Shipping Address */}
          <Card shadow="sm" className="bg-gray-50 dark:bg-gray-900">
            <CardHeader>
              <p className="text-lg font-semibold flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />
                Shipping Address
              </p>
            </CardHeader>
            <CardBody>
              {orderData.address ? (
                <div className="flex flex-col gap-3">
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
        </div>
      </div>
    </div>
  );
}

export default UserOrderDetails;
