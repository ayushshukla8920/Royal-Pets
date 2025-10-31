import { NextResponse } from "next/server"
import pool from "@/lib/db"
import axios from "axios"
import { v4 as uuidv4 } from 'uuid'

export async function POST(req) {
    try {
        const {uuid,phone} = await req.json();
        let total = 1;
        const client_id = process.env.ENV === "prod" ? process.env.CF_APIKEY_PROD : process.env.CF_APIKEY_TEST;
        const client_secret = process.env.ENV === "prod" ? process.env.CF_APISECRET_PROD : process.env.CF_APISECRET_TEST;
        const sid = uuid;
        const res = await axios.post(
            `${process.env.ENV === "prod"
                ? "https://api.cashfree.com"
                : "https://sandbox.cashfree.com"
            }/pg/orders`,
            {
                order_amount: total,
                order_currency: "INR",
                customer_details: {
                    customer_id: sid,
                    customer_phone: phone
                },
                order_meta: {
                    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/nb-payment/redirect?order_id={order_id}`
                }
            },
            {
                headers: {
                    "x-api-version": "2025-01-01",
                    "Content-Type": "application/json",
                    "x-client-id": client_id,
                    "x-client-secret": client_secret
                }
            }
        )
        const cashfreeOrder = res.data
        return NextResponse.json({ success: true, paymentSessionId: cashfreeOrder.payment_session_id })
    } catch (err) {
        console.error("Cashfree Checkout Error", err)
        return NextResponse.json({ success: false, message: "Payment initiation failed" }, { status: 500 })
    }
}
