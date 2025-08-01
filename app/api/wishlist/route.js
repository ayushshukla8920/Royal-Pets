// /app/api/wishlist/route.js
import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })

  try {
    const result = await pool.query(
      `
      SELECT w.product_id, p.name, p.price, p.image
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = $1
      `,
      [user.id]
    )
    return NextResponse.json({ success: true, items: result.rows })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ success: false, message: "DB Error" }, { status: 500 })
  }
}
