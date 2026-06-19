import { getAllCoupons } from "@/services/Coupon";
import AdminCouponsContainer from "./AdminCouponsContainer";

export default async function AdminCouponsPage() {
  const res = await getAllCoupons();
  const coupons = res?.data || [];

  return <AdminCouponsContainer initialCoupons={coupons} />;
}
