export const orderStatuses = {
  pending: "Новый",
  confirmed: "Подтверждён",
  paid: "Оплачен",
  shipped: "Отправлен",
  completed: "Завершён",
  cancelled: "Отменён",
} as const

export type OrderStatus = keyof typeof orderStatuses

export function getOrderStats(orders: readonly { status: OrderStatus }[]) {
  const total = orders.length
  const pending = orders.filter((order) => order.status === "pending").length
  const cancelled = orders.filter((order) => order.status === "cancelled").length
  const confirmed = total - pending - cancelled
  return {
    total,
    pending,
    cancelled,
    confirmed,
    confirmationRate: total ? (confirmed / total) * 100 : 0,
  }
}
