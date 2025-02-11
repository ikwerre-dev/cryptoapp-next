import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { headers } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET(req: Request) {
    try {
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
                `SELECT 
                    uts.*,
                    tb.name as bot_name
                FROM user_trading_sessions uts
                JOIN trading_bots tb ON uts.bot_id = tb.id
                WHERE uts.user_id = ?
                ORDER BY uts.start_date DESC`,
                [decoded.userId]
            )

            return NextResponse.json({ sessions })
        } finally {
            connection.release()
        }
    } catch (error) {
        console.error("Failed to fetch sessions:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to fetch sessions" },
            { status: 500 }
        )
    }
}