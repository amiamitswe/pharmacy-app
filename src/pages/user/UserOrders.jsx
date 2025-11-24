import { Card, CardBody, CardHeader, Chip, Spinner } from "@heroui/react";
import React, { useEffect, useState } from "react";
import orderService from "../../api-services/orderService";
import { FaCalendarAlt, FaMoneyBillWave, FaBox, FaTruck } from "react-icons/fa";

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrders();
        if (response.status === 200) {
          setOrders(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
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
    if (statusLower === "pending" || statusLower === "processing") {
      return "warning";
    }
    if (statusLower === "delivered" || statusLower === "completed") {
      return "success";
    }
    if (statusLower === "cancelled" || statusLower === "failed") {
      return "danger";
    }
    return "default";
  };

  return (
    <div className="flex flex-col gap-4">
      <Card shadow="sm" className="bg-gray-50 dark:bg-gray-900">
        <CardHeader className="flex justify-between items-center">
          <p className="text-lg font-semibold">
            My Orders
            {orders?.length > 0 && (
              <span className="text-gray-500 ml-2">({orders.length})</span>
            )}
          </p>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center items-center flex-col h-[200px]">
              <Spinner color="primary" />
              <p className="text-sm mt-4 text-gray-500">Loading orders...</p>
            </div>
          ) : orders?.length > 0 ? (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <Card
                  key={order._id}
                  shadow="sm"
                  className="border-1 border-gray-200 dark:border-gray-700"
                >
                  <CardBody>
                    <div className="flex flex-col gap-4">
                      {/* Order Header */}
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div className="flex flex-col gap-1">
                          <p className="text-lg font-semibold">
                            Order #{order.orderID}
                          </p>
                          <p className="text-xs text-gray-500">
                            Placed on {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <Chip
                          color={getStatusColor(order.status)}
                          variant="flat"
                          size="sm"
                        >
                          {order.status || "Pending"}
                        </Chip>
                      </div>

                      {/* Order Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t-1 border-gray-200 dark:border-gray-700">
                        {/* Total Amount */}
                        <div className="flex items-center gap-2">
                          <FaMoneyBillWave className="text-teal-500 text-lg" />
                          <div>
                            <p className="text-xs text-gray-500">Total Amount</p>
                            <p className="text-sm font-semibold">
                              {order.totalPrice?.toFixed(2) || "0.00"} Taka
                            </p>
                          </div>
                        </div>

                        {/* Items Count */}
                        <div className="flex items-center gap-2">
                          <FaBox className="text-blue-500 text-lg" />
                          <div>
                            <p className="text-xs text-gray-500">Items</p>
                            <p className="text-sm font-semibold">
                              {order.orderItems?.length || 0} item(s)
                            </p>
                          </div>
                        </div>

                        {/* Delivery Date */}
                        <div className="flex items-center gap-2">
                          <FaTruck className="text-green-500 text-lg" />
                          <div>
                            <p className="text-xs text-gray-500">Delivery Date</p>
                            <p className="text-sm font-semibold">
                              {formatDate(order.deliveryScheduledAt)}
                            </p>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-purple-500 text-lg" />
                          <div>
                            <p className="text-xs text-gray-500">Payment</p>
                            <p className="text-sm font-semibold capitalize">
                              {order.paymentMethod || "COD"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      {order.items && order.items.length > 0 && (
                        <div className="pt-2 border-t-1 border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-500 mb-2">Order Items:</p>
                          <div className="flex flex-wrap gap-2">
                            {order.items.slice(0, 3).map((item, index) => (
                              <Chip
                                key={index}
                                size="sm"
                                variant="flat"
                                className="text-xs"
                              >
                                {item.medicine?.medicineName || item.name} x
                                {item.quantity}
                              </Chip>
                            ))}
                            {order.items.length > 3 && (
                              <Chip size="sm" variant="flat" className="text-xs">
                                +{order.items.length - 3} more
                              </Chip>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px]">
              <p className="text-lg font-semibold text-gray-500">
                No orders found
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Your order history will appear here
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default UserOrders;
