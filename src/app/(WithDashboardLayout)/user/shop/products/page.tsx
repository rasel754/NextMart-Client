import ManageProducts from "@/components/modules/shop/product";
import { getAllProducts } from "@/services/product";
import React from "react";

const ManageProductPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page } = await searchParams;
  const { data, meta } = await getAllProducts({ page });
  return (
    <div>
      <ManageProducts products={data} meta={meta}></ManageProducts>
    </div>
  );
};

export default ManageProductPage;
