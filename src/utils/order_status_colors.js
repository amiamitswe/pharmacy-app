export const getStatusColor = (status) => {
  const statusLower = status?.toLowerCase();

  // Map specific order statuses to Hero UI colors
  switch (statusLower) {
    case "order_pending":
      return "warning"; // Yellow/Orange for pending orders
    case "order_placed":
      return "primary"; // Blue for newly placed orders
    case "order_confirmed":
      return "secondary"; // Indigo/Purple for confirmed orders
    case "order_cancelled":
      return "danger"; // Red for cancelled orders
    case "order_in_delivery_que":
      return "primary"; // Blue for orders in delivery queue
    case "order_returned":
      return "warning"; // Yellow/Orange for returned orders
    case "order_delivered":
      return "success"; // Green for delivered orders
    default:
      return "default"; // Gray for unknown statuses
  }
};
