import ProductBanner from "@/components/modules/products/banner";
import ProductDetails from "@/components/modules/products/productDetails";
import NMContainer from "@/components/ui/core/NMContainer";
import { getSingleProduct, getAllProducts } from "@/services/product";

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = await params;

  const res = await getSingleProduct(productId);
  const product = res?.data || res;

  // Fetch related products
  let relatedProducts = [];
  if (product && product.category) {
    const categoryId = product.category._id || product.category;
    const relatedRes = await getAllProducts({ category: categoryId });
    if (relatedRes?.data) {
      relatedProducts = relatedRes.data.filter((p: any) => p._id !== product._id);
    }
  }

  return (
    <NMContainer>
      <ProductBanner
        title="Product Details"
        path={`Home - Products - ${product?.name || "Details"}`}
      />
      {product ? (
        <ProductDetails product={product} relatedProducts={relatedProducts} />
      ) : (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground">Product not found.</p>
        </div>
      )}
    </NMContainer>
  );
};

export default ProductDetailsPage;