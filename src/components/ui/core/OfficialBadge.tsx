import React from "react";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck } from "lucide-react";

export const OfficialBadge = () => (
  <Badge className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 w-fit rounded-full text-[10px] px-2.5 py-0.5 font-bold shadow-sm border-transparent select-none shrink-0">
    <BadgeCheck className="w-3.5 h-3.5" />
    Official
  </Badge>
);
