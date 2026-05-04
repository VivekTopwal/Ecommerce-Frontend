import { Suspense } from "react";
import CheckoutContent from "./CheckoutContent";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}