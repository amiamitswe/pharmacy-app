import { useState, useEffect, useMemo } from "react";
import orderService from "../../api-services/orderService";
import {
  Spinner,
  Select,
  SelectItem,
  DatePicker,
  Card,
  CardBody,
  Button,
} from "@heroui/react";
import { today } from "@internationalized/date";
import AdminOrderItem from "../../components/admin/AdminOrderItem";
import PaginationComponent from "../../components/common/PaginationComponent";
import { FaFilter, FaTimes, FaSortUp, FaSortDown } from "react-icons/fa";
import { ORDER_SORT_OPTIONS, ORDER_STATUS_OPTIONS } from "../../utils/order_related_static_data";

const DHAKA_TIMEZONE = "Asia/Dhaka";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("order_pending");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params = {};
        if (statusFilter) params.status = statusFilter;
        if (startDate) {
          const date = startDate.toDate(DHAKA_TIMEZONE);
          params.startDate = date.toISOString().split("T")[0];
        }
        if (endDate) {
          const date = endDate.toDate(DHAKA_TIMEZONE);
          params.endDate = date.toISOString().split("T")[0];
        }
        if (sortOrder) params.sort = sortOrder;
        if (currentPage) params.page = currentPage;
        if (limit) params.limit = limit;

        const response = await orderService.getOrdersByAdmin(params);
        if (response.status === 200 && response.data.status) {
          // API response structure: { result: [], total: 6, dataCount: 2, limit: 2, status: true, message: "..." }
          setOrders(response.data.result || []);
          setTotalOrders(response.data.total || 0);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [statusFilter, startDate, endDate, sortOrder, currentPage, limit]);

  // Calculate pagination from server-side total
  const totalPages = Math.ceil(totalOrders / limit);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, startDate, endDate, sortOrder, limit]);

  // Calculate orders matching the selected status filter
  const filteredOrdersCount = useMemo(() => {
    if (!statusFilter) {
      return orders.length;
    }
    return orders.filter((order) => {
      const orderStatus = order?.orderStatus?.toLowerCase() || "";
      return orderStatus === statusFilter.toLowerCase();
    }).length;
  }, [orders, statusFilter]);

  // Get the status label for display
  const statusLabel = useMemo(() => {
    if (!statusFilter) {
      return "All Orders";
    }
    const statusOption = ORDER_STATUS_OPTIONS.find(
      (opt) => opt.value === statusFilter
    );
    return statusOption ? `${statusOption.label} Orders` : "Orders";
  }, [statusFilter]);

  const handleClearFilters = () => {
    setStatusFilter("order_pending");
    setStartDate(null);
    setEndDate(null);
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const hasActiveFilters = statusFilter !== "order_pending" || startDate || endDate || sortOrder !== "desc";

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Section */}
      <Card shadow="sm">
        <CardBody className="p-3">
          <div className="flex flex-col gap-2">
            {/* Status Count - Moved to Top */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
                 Current {statusLabel}:
                </span>
                <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                  {filteredOrdersCount}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  ({orders.length} on page, {totalOrders} total)
                </span>
              </div>
              {hasActiveFilters && (
                <Button
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={handleClearFilters}
                  startContent={<FaTimes />}
                  className="h-7 min-w-0 px-2 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between mt-1">
              <h3 className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                <FaFilter className="text-xs" />
                Filters
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {/* Status Filter */}
              <Select
                size="sm"
                label="Order Status"
                placeholder="Select status"
                selectedKeys={statusFilter ? new Set([statusFilter]) : new Set()}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  setStatusFilter(selected || "");
                }}
                variant="bordered"
              >
                {ORDER_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>

              {/* Start Date */}
              <DatePicker
                size="sm"
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                variant="bordered"
                maxValue={endDate || today(DHAKA_TIMEZONE)}
              />

              {/* End Date */}
              <DatePicker
                size="sm"
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                variant="bordered"
                minValue={startDate || undefined}
                maxValue={today(DHAKA_TIMEZONE)}
              />

              {/* Sort Order */}
              <Select
                size="sm"
                label="Sort Order"
                placeholder="Select sort"
                selectedKeys={new Set([sortOrder])}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  setSortOrder(selected || "desc");
                }}
                variant="bordered"
                startContent={
                  sortOrder === "asc" ? (
                    <FaSortUp className="text-gray-400" />
                  ) : (
                    <FaSortDown className="text-gray-400" />
                  )
                }
              >
                {ORDER_SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Spinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardBody className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No orders found matching your filters.
            </p>
          </CardBody>
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <AdminOrderItem key={order.id || order.orderID} order={order} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationComponent
              currentPage={currentPage}
              total={totalPages}
              onChange={setCurrentPage}
              limit={limit}
              setLimit={setLimit}
              showControls={true}
            />
          )}
        </>
      )}
    </div>
  );
}
