import Category from "@/components/modules/home/Category";
import FeaturedProducts from "@/components/modules/home/FeaturedProducts";
import FlashSale from "@/components/modules/home/FlashSale";
import HeroSection from "@/components/modules/home/heroSection";

const HomePage = () => {
  return (
    <div>
      <HeroSection></HeroSection>
      <Category></Category>
      <FeaturedProducts></FeaturedProducts>
      <FlashSale></FlashSale>
    </div>
  );
};

export default HomePage;
