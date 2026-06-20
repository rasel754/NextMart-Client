import { Button } from "@/components/ui/button";
import NMContainer from "@/components/ui/core/NMContainer";
import { getFlashSaleProducts } from "@/services/FlashSale";
import Link from "next/link";
import CountDown from "./CountDown";
import FlashSaleCarousel from "./FlashSaleCarousel";

const FlashSale = async () => {
  const { data: products } = await getFlashSaleProducts();

  return (
   <NMContainer>
     <div className="bg-white bg-opacity-50 py-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl">Flash Sale</h2>
          <CountDown></CountDown>
          <Link href="/flash-sales">
            <Button variant="outline" className="rounded-full">
              All Collection
            </Button>
          </Link>
        </div>

        <div className="my-8">
          <FlashSaleCarousel products={products || []} />
        </div>
      </div>
    </div>
   </NMContainer>
  );
};

export default FlashSale;