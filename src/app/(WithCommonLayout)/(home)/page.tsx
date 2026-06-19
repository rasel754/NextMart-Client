import Category from "@/components/modules/home/Category";
import FeaturedProducts from "@/components/modules/home/FeaturedProducts";
import FlashSale from "@/components/modules/home/FlashSale";
import HeroSection from "@/components/modules/home/heroSection";
import StatsSection from "@/components/modules/home/StatsSection";
import TopBrands from "@/components/modules/home/TopBrands";
import Testimonials from "@/components/modules/home/Testimonials";
import NewsletterCTA from "@/components/modules/home/NewsletterCTA";

const HomePage = () => {
  return (
    <div className="space-y-6 pb-12">
      <HeroSection />
      <Category />
      <FeaturedProducts />
      <FlashSale />
      <StatsSection />
      <TopBrands />
      <Testimonials />
      <NewsletterCTA />
    </div>
  );
};

export default HomePage;
