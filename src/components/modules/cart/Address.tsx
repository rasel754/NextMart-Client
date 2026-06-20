"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cities } from "@/contants/cities";
import {
  citySelector,
  shippingAddressSelector,
  updateCity,
  updateShippingAddress,
} from "@/redux/featurs/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function Address() {
  const dispatch = useAppDispatch();
  const selectCity = useAppSelector(citySelector);
  const shippingAddress = useAppSelector(shippingAddressSelector);

  const handleCitySelect = (city: string) => {
    dispatch(updateCity(city));
  };

  const handleShippingAddress = (address: string) => {
    dispatch(updateShippingAddress(address));
  };

  return (
    <div className="border border-border/60 bg-card rounded-2xl col-span-12 md:col-span-4 p-5 shadow-sm space-y-4">
      <div>
        <h1 className="text-xl font-bold text-foreground">Delivery Location</h1>
        <p className="text-xs text-muted-foreground mt-1">Specify your target delivery city and address.</p>
      </div>

      <div className="space-y-4 pt-1">
        <Select value={selectCity || ""} onValueChange={handleCitySelect}>
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Textarea
          value={shippingAddress}
          onChange={(e) => handleShippingAddress(e.target.value)}
          placeholder="Detailed shipping address coordinates..."
          rows={4}
          className="rounded-xl border-border/80 focus-visible:ring-primary"
        />
      </div>
    </div>
  );
}