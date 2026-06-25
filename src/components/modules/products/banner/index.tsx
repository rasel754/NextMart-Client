import styles from "./Banner.module.css";
import Link from "next/link";
import { ChevronRight, Home, ShoppingBag, Tag, CreditCard, Layers } from "lucide-react";

const getRouteInfo = (name: string) => {
  const normalized = name.trim().toLowerCase();
  switch (normalized) {
    case "home":
      return { url: "/", icon: <Home className="w-3.5 h-3.5" /> };
    case "products":
      return { url: "/products", icon: <ShoppingBag className="w-3.5 h-3.5" /> };
    case "flash sales":
      return { url: "/flash-sales", icon: <Tag className="w-3.5 h-3.5" /> };
    case "cart":
    case "cart page":
      return { url: "/cart", icon: <Layers className="w-3.5 h-3.5" /> };
    case "checkout":
      return { url: "/checkout", icon: <CreditCard className="w-3.5 h-3.5" /> };
    default:
      return { url: null, icon: null };
  }
};

const ProductBanner = ({ title, path }: { title: string; path: string }) => {
  const pathSegments = path.split(" - ");

  return (
    <div
      className={`${styles.banner} rounded-3xl mt-10 flex justify-center items-center px-6 relative border border-[#3b49df]/10 dark:border-white/5 shadow-inner overflow-hidden`}
    >
      {/* Decorative Blobs */}
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />

      {/* Main Glass Content Card */}
      <div className="text-center z-10 bg-white/40 dark:bg-black/35 backdrop-blur-md px-8 py-6 rounded-2xl border border-white/40 dark:border-white/5 shadow-lg max-w-xl w-full transition hover:scale-[1.01] duration-300">
        <h2 className="font-extrabold text-3xl md:text-4xl tracking-tight bg-gradient-to-r from-[#3b49df] via-[#5865f2] to-[#10b981] dark:from-white dark:via-[#e2e8f0] dark:to-[#10b981] bg-clip-text text-transparent mb-3 select-none">
          {title}
        </h2>
        
        {/* Dynamic Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-sm font-medium">
          {pathSegments.map((segment, idx) => {
            const routeInfo = getRouteInfo(segment);
            const isLast = idx === pathSegments.length - 1;

            return (
              <span key={segment} className="flex items-center">
                {idx > 0 && (
                  <ChevronRight className="w-4 h-4 mx-1.5 text-muted-foreground/50 shrink-0" />
                )}
                {routeInfo.url && !isLast ? (
                  <Link
                    href={routeInfo.url}
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary dark:hover:text-[#5865f2] transition-colors duration-200"
                  >
                    {routeInfo.icon}
                    <span>{segment}</span>
                  </Link>
                ) : (
                  <span className={`flex items-center gap-1 ${isLast ? "text-foreground font-black" : "text-muted-foreground"}`}>
                    {routeInfo.icon}
                    <span className="line-clamp-1 max-w-[200px]">{segment}</span>
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductBanner;