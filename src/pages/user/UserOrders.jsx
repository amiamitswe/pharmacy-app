import {
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Select,
  SelectItem,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import orderService from "../../api-services/orderService";
import {
  ORDER_SORT_OPTIONS,
  ORDER_STATUS_OPTIONS,
} from "../../utils/order_related_static_data";
import UserOrderItem from "../../components/user/orders/UserOrderItem";
import PaginationComponent from "../../components/common/PaginationComponent";

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("order_pending");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const params = {};
        if (statusFilter) params.status = statusFilter;
        if (sortOrder) params.sort = sortOrder;
        if (currentPage) params.page = currentPage;
        if (limit) params.limit = limit;

        const response = await orderService.getOrders(params);
        if (response.status === 200) {
          setOrders(response.data.result || []);
          // Handle different possible response structures
          setTotalOrders(
            response.data.total ||
              response.data.count ||
              (response.data.data || []).length
          );
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [statusFilter, sortOrder, currentPage, limit]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sortOrder, limit]);

  // Calculate pagination from server-side total
  const totalPages = Math.ceil(totalOrders / limit);

  // Use orders directly since filtering and sorting is done on the server
  const filteredAndSortedOrders = orders;

  return (
    <div className="flex flex-col gap-4">
      <Card shadow="sm" className="bg-gray-50 dark:bg-gray-900 p-2 md:p-4">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <p className="text-lg font-semibold">
            My Orders
            {filteredAndSortedOrders?.length > 0 && (
              <span className="text-gray-500 ml-2">
                ({filteredAndSortedOrders.length})
              </span>
            )}
          </p>
          <div className="flex flex-row gap-3 items-center w-full sm:w-auto">
            <Select
              size="sm"
              label="Filter by Status"
              placeholder="All Status"
              selectedKeys={
                statusFilter
                  ? new Set([statusFilter])
                  : new Set(["order_pending"])
              }
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setStatusFilter(selected || "order_pending");
              }}
              variant="bordered"
              className="flex-1 sm:flex-none sm:w-[180px]"
            >
              {ORDER_STATUS_OPTIONS?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              size="sm"
              label="Sort by"
              placeholder="Sort"
              selectedKeys={
                sortOrder ? new Set([sortOrder]) : new Set(["desc"])
              }
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setSortOrder(selected || "desc");
              }}
              variant="bordered"
              className="flex-1 sm:flex-none sm:w-[160px]"
            >
              {ORDER_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </CardHeader>
        <CardBody className="md:min-h-[calc(100vh-265px)]">
          {loading ? (
            <div className="flex justify-center items-center flex-col h-[200px]">
              <Spinner color="primary" />
              <p className="text-sm mt-4 text-gray-500">Loading orders...</p>
            </div>
          ) : filteredAndSortedOrders?.length > 0 ? (
            <>
              <div className="flex flex-col gap-4">
                {filteredAndSortedOrders.map((order) => (
                  <UserOrderItem key={order.id} order={order} />
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
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px]">
              <p className="text-lg font-semibold text-gray-500">
                {statusFilter && statusFilter !== ""
                  ? "No orders found with selected filter"
                  : "No orders found"}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {statusFilter && statusFilter !== ""
                  ? "Try adjusting your filters"
                  : "Your order history will appear here"}
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default UserOrders;
