import {
  cancelOrder as cancelOrderRepo,
  createOrder as createOrderRepo,
  getOrderById as getOrderByIdRepo,
  getOrderHistory as getOrderHistoryRepo,
  type CreateOrderInput,
  type OrderHistoryItem,
} from "@/lib/repositories/bookingRepository";

export type { CreateOrderInput, OrderHistoryItem };

export async function createOrder(input: CreateOrderInput): Promise<string> {
  return createOrderRepo(input);
}

export async function getOrderHistory(
  customerId: string,
): Promise<OrderHistoryItem[]> {
  return getOrderHistoryRepo(customerId);
}

export async function getOrderById(
  orderId: string,
  customerId: string,
): Promise<OrderHistoryItem | null> {
  return getOrderByIdRepo(orderId, customerId);
}

export async function cancelOrder(
  orderId: string,
  customerId: string,
): Promise<void> {
  return cancelOrderRepo(orderId, customerId);
}
