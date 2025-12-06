import { Card, CardBody, Chip } from "@heroui/react";
import { FaCalendarAlt, FaMoneyBillWave, FaBox, FaTruck } from "react-icons/fa";
import { Link } from "react-router";
import { getStatusColor } from "../../../utils/order_status_colors";

function UserOrderItem({ order }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${datePart} at ${timePart}`;
  };

  const getDateColor = (dateString) => {
    if (!dateString) return "text-gray-500";
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return "text-orange-500";
    } else if (compareDate < today) {
      return "text-red-500";
    } else {
      return "text-green-500";
    }
  };



  return (
    <Link to={`/user/orders/${order.id}`}>
      <Card
        shadow="sm"
        className="border-1 border-gray-200 dark:border-gray-700 md:p-4 p-2"
      >
        <CardBody>
          <div className="flex flex-col gap-4">
            {/* Order Header */}
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div className="flex flex-col md:flex-row md:items-center md:gap-3 gap-1">
                <p className="text-lg font-semibold">Order #{order.orderID}</p>
                <p className="text-xs text-gray-500">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <Chip
                color={getStatusColor(order.orderStatus)}
                variant="flat"
                size="sm"
                className="capitalize"
              >
                {order.orderStatus?.replace(/_/g, " ") || "Pending"}
              </Chip>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t-1 border-gray-200 dark:border-gray-700">
              {/* Total Amount */}
              <div className="flex items-center gap-2">
                <FaMoneyBillWave className="text-teal-500 text-lg" />
                <div className="text-left">
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="text-sm font-semibold">
                    {order.totalPrice?.toFixed(2) || "0.00"} Taka
                  </p>
                </div>
              </div>

              {/* Items Count */}
              <div className="flex items-center gap-2">
                <FaBox className="text-blue-500 text-lg" />
                <div className="text-left">
                  <p className="text-xs text-gray-500">Items</p>
                  <p className="text-sm font-semibold">
                    {order.orderItemsCount || 0} item(s)
                  </p>
                </div>
              </div>

              {/* Delivery Date */}
              <div className="flex items-center gap-2">
                <FaTruck className="text-green-500 text-lg" />
                <div className="text-left">
                  <p className="text-xs text-gray-500">Delivery Date</p>
                  <p
                    className={`text-sm font-semibold ${getDateColor(
                      order.deliveryScheduledAt
                    )}`}
                  >
                    {formatDate(order.deliveryScheduledAt)}
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-purple-500 text-lg" />
                <div className="text-left">
                  <p className="text-xs text-gray-500">Payment</p>
                  <p className="text-sm font-semibold uppercase">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

export default UserOrderItem;
