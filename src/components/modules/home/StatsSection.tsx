"use client";

import { useEffect, useState } from "react";
import NMContainer from "@/components/ui/core/NMContainer";

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter = ({ end, suffix = "", duration = 2000 }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = Math.ceil(end / (duration / 30));
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default function StatsSection() {
  const stats = [
    { label: "Total Products", end: 12500, suffix: "+" },
    { label: "Happy Customers", end: 98000, suffix: "+" },
    { label: "Active Vendors", end: 1200, suffix: "+" },
    { label: "Orders Delivered", end: 150000, suffix: "+" },
  ];

  return (
    <NMContainer>
      <div className="my-16 py-12 bg-card border border-border/75 rounded-3xl shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-3xl md:text-5xl font-black text-primary tracking-tight">
                <AnimatedCounter end={stat.end} suffix={stat.suffix} />
              </h3>
              <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </NMContainer>
  );
}
