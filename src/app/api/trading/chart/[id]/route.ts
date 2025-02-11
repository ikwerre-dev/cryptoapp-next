import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { headers } from "next/headers"
import jwt from "jsonwebtoken"
import { gunzip } from 'zlib'
import { promisify } from 'util'

const gunzipAsync = promisify(gunzip)

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const sessionId = params.id
    const headersList = headers()
    const authHeader = (await headersList).get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }

    const connection = await pool.getConnection()
    try {
      const [sessions]: any = await connection.query(
        `SELECT trading_data_url FROM user_trading_sessions WHERE id = ? AND user_id = ?`,
        [sessionId, decoded.userId]
      )

      if (!sessions.length) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 })
      }

      const session = sessions[0]
      const response = await fetch(session.trading_data_url)
      const compressedData = await response.arrayBuffer()
      const decompressedData = await gunzipAsync(Buffer.from(compressedData))
      const tradingData = JSON.parse(decompressedData.toString())

      return NextResponse.json({ tradingData })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Failed to fetch chart data:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch chart data" },
      { status: 500 }
    )
  }
}