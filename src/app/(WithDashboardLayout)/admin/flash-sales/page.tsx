import { getFlashSaleSchedules } from "@/services/FlashSale";
import { getAllProducts } from "@/services/product";
import AdminFlashSalesContainer from "./AdminFlashSalesContainer";

export default async function AdminFlashSalesPage() {
  const [flashSaleRes, productsRes] = await Promise.all([
    getFlashSaleSchedules(),
    getAllProducts({ limit: 100 }), // retrieve products for select options
  ]);

  const flashSales = flashSaleRes?.data || [];
  const products = productsRes?.data || productsRes?.result || [];

  return (
    <AdminFlashSalesContainer
      initialFlashSales={flashSales}
      productsList={products}
    />
  );
}
