import { NextResponse } from "next/server"
import axios from "axios"

export async function GET(req) {
  const order_id = req.nextUrl.searchParams.get("order_id")
  if (!order_id) return NextResponse.json({ success: false, message: "Order ID required" }, { status: 400 })
  try {
    const baseurl = `${process.env.ENV === "prod" ? "https://api.cashfree.com" : "https://sandbox.cashfree.com"}/pg/orders/${order_id}/extended`;
    const client_id = process.env.ENV === "prod" ? process.env.CF_APIKEY_PROD : process.env.CF_APIKEY_TEST;
    const client_secret = process.env.ENV === "prod" ? process.env.CF_APISECRET_PROD : process.env.CF_APISECRET_TEST;
    const response = await axios.get(baseurl, {
      headers: {
        "x-api-version": "2025-01-01",
        "Content-Type": "application/json",
        "x-client-id": client_id,
        "x-client-secret": client_secret
      }
    });
    const devId = response.data.customer_details.customer_id;
    return NextResponse.json({ devId });
  } catch (err) {
    console.error("Payment verify error:", err)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
