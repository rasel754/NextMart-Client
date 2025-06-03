export const curencyFormatter = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
  }).format(value);
};
