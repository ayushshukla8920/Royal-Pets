'use client';

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { load } from "@cashfreepayments/cashfree-js";
import { toast, Toaster } from "sonner";

export default function PaymentPage() {
  const cashfreeRef = useRef(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentSessionId = searchParams.get("paymentSessionId");

  useEffect(() => {
    const initializeAndPay = async () => {
      if (!paymentSessionId) {
        toast.error("Missing paymentSessionId in query params");
        return;
      }

      try {
        const cf = await load({ mode: "production" }); // or "sandbox"
        cashfreeRef.current = cf;
        await cf.checkout({
          paymentSessionId,
          redirectTarget: "_self",
        });
      } catch (err) {
        console.error("Cashfree error:", err);
        toast.error("Failed to start payment");
      }
    };

    initializeAndPay();
  }, [paymentSessionId]);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <Toaster />
      <h1>Redirecting to Payment Gateway...</h1>
      <p>Please wait while we securely process your payment.</p>
    </main>
  );
}
