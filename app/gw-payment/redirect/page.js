'use client';

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function CallbackHandler() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  useEffect(() => {
    const verifyAndRedirect = async () => {
      if (!orderId) return;
      try {
        const res = await fetch(`/api/payment/cashfree/nbh/verify?order_id=${encodeURIComponent(orderId)}`);
        if (!res.ok) throw new Error("Verification failed");
        const data = await res.json();
        if (!data.devId) throw new Error("Invalid response from server");
        const redirectUrl = `https://pay.ayushshukla8920.me/api/v1/payment/success`;
        window.location.href = redirectUrl;
      } catch (err) {
        console.error("Callback error:", err);
      }
    };

    verifyAndRedirect();
  }, [orderId]);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Verifying Payment...</h1>
      <p>Please wait while we complete your transaction.</p>
    </main>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}
