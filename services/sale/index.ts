import { SALES_KEY } from "@/constants/key-storage";
import { Sale } from "@/interface/sale/sale";
import { getData, saveData } from "@/storage";

export const getSales = async () => {
  const data = await getData(SALES_KEY);

  const sales: Sale[] =
    data?.map((s: any) => {
      let response: Sale;
      response = {
        ...s,
        purchsePrice: Number(s.purchasePrice ?? 0),
        quantity: Number(s?.quantity ?? 0),
        salePrice: Number(s?.salePrice ?? 0),
        totalAmount: Number(s?.totalAmount ?? 0),
        isCredit: s?.isCredit === "true" || s?.isCredit === true ? true : false,
      };
      return response;
    }) ?? [];

  return sales;
};

export const saveSales = async (data: Sale[]) => {
  await saveData(SALES_KEY, data);
};

export const updateLocalSales = async (data: Sale[], updatedSale: Sale) => {
  return data.map((sale) => (sale.id === updatedSale.id ? updatedSale : sale));
};

// Replaces all Sales belonging to groupId with newSales. Pure — no side effects.
export const updateSaleGroup = (
  groupId: string,
  newSales: Sale[],
  allSales: Sale[]
): Sale[] => {
  const withoutGroup = allSales.filter((s) => s.groupId !== groupId);
  return [...newSales, ...withoutGroup];
};
