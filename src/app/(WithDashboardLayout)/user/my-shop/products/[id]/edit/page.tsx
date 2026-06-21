import MyShopUpdateProductForm from "@/components/modules/shop/product/MyShopUpdateProductForm";
import { getSingleProduct } from "@/services/product";

interface IEditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function MyShopEditProductPage({ params }: IEditProductPageProps) {
  const { id } = await params;
  const { data: product } = await getSingleProduct(id);

  return (
    <div className="flex items-center justify-center py-6">
      <MyShopUpdateProductForm product={product} />
    </div>
  );
}
