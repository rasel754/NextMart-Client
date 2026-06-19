import NMContainer from "@/components/ui/core/NMContainer";
import { Star } from "lucide-react";
import Image from "next/image";

export default function Testimonials() {
  const reviews = [
    {
      name: "Rashed Ahmed",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      stars: 5,
      comment: "Absolutely love the fast shipping! Order was delivered within 24 hours inside Dhaka, and the customer service team was extremely helpful.",
    },
    {
      name: "Tania Sultana",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      stars: 5,
      comment: "Creating a shop was a breeze! Within an hour I had listed all my handmade crafts. NextMart is the best multi-vendor platform in BD.",
    },
    {
      name: "Nabil Rahman",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      stars: 4,
      comment: "Purchased a mechanical keyboard. High quality item, secure payment gateway, and easy checkout flows. Highly recommended site!",
    },
  ];

  return (
    <NMContainer>
      <div className="my-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-bold text-2xl md:text-3xl mb-2">What Our Customers Say</h2>
          <p className="text-sm text-muted-foreground">
            Don&apos;t just take our word for it. Thousands of buyers and sellers trust NextMart every single day.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-card border border-border/60 p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition shadow-sm"
            >
              <div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.stars
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted border-none"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic mb-6">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-primary/20">
                  <Image src={rev.avatar} alt={rev.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{rev.name}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </NMContainer>
  );
}
