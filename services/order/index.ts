import { ORDER_KEY } from "@/constants/key-storage";
import { Order, OrderItem } from "@/interface/order";
import { OrderDTO } from "@/interface/order/schema";
import { TypeUnit } from "@/interface/product/product";
import { getData, saveData } from "@/storage";

export const getOrders = async () => {
  const data = await getData(ORDER_KEY);

  const orders: Order[] =
    data?.map((o: any) => {
      let response: Order;
      response = {
        ...o,
      };
      return response;
    }) ?? [];

  return orders;
};

export const saveOrders = async (data: Order[]) => {
  await saveData(ORDER_KEY, data);
};

export const updateLocalOrder = async (data: Order[], updatedOrder: Order) => {
  return data.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
};

export const convertDtoToOrder = (orderDto: OrderDTO) => ({
  id: String(Date.now()),
  total: Number(orderDto.total),
  order: orderDto.order.map((o) => ({
    subTotal: Number(o.subTotal),
    quantity: Number(o.quantity),
    unitPrice: Number(o.unitPrice),
    productId: o.productId,
    productName: o.productName,
    stockImpact: Number(o.stockImpact),
    unit: o.unit as TypeUnit,
  })) as OrderItem[],
  clientId: orderDto.clientId,
  clientName: orderDto.clientName,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
