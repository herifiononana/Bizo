type AmountFields = {
  quantity: string;
  salePrice: string;
  totalPrice?: string;
};

const toPositiveNumber = (value: string): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const formatTotal = (total: number): string => (total ? total.toFixed(2) : "");

// Quantité modifiée : le total suit, avec le prix saisi dans le formulaire.
export const applyQuantityChange = <T extends AmountFields>(
  fields: T,
  quantity: string
): T => ({
  ...fields,
  quantity,
  totalPrice: formatTotal(
    toPositiveNumber(quantity) * toPositiveNumber(fields.salePrice)
  ),
});

// Prix modifié : le total suit ; sans quantité, c'est la quantité qui se déduit du total saisi.
export const applyPriceChange = <T extends AmountFields>(
  fields: T,
  salePrice: string
): T => {
  const price = toPositiveNumber(salePrice);
  const quantity = toPositiveNumber(fields.quantity);
  const total = toPositiveNumber(fields.totalPrice ?? "");

  if (quantity > 0) {
    return { ...fields, salePrice, totalPrice: formatTotal(quantity * price) };
  }
  if (total > 0 && price > 0) {
    return { ...fields, salePrice, quantity: String(total / price) };
  }
  return { ...fields, salePrice };
};

// Total modifié : la quantité se déduit du prix saisi.
export const applyTotalChange = <T extends AmountFields>(
  fields: T,
  totalPrice: string
): T => {
  const price = toPositiveNumber(fields.salePrice);
  return {
    ...fields,
    totalPrice,
    quantity: price > 0 ? String(Number(totalPrice) / price) : fields.quantity,
  };
};
