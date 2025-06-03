import UpdateProductsForm from "@/components/modules/shop/product/UpdateProductForm";
import { getSingleProduct } from "@/services/product";

const UpadateProductPage =async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {

  const {productId} =await params

  const {data:product} = await getSingleProduct(productId);
  return (
    <div className="flex items-center justify-center">
     <UpdateProductsForm product={product}></UpdateProductsForm>
    </div>
  );
};

export default UpadateProductPage;
