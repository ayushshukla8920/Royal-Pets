'use client';

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const deviceId = searchParams.get("order_id");

  useEffect(() => {
    if (!deviceId) return;

    const redirectUrl = `https://nbhackintool.vercel.app/payment/verification?deviceId=${encodeURIComponent(deviceId)}`;
    window.location.href = redirectUrl;
  }, [deviceId]);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Redirecting...</h1>
      <p>Please wait while we verify your payment.</p>
    </main>
  );
}
