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
                WHERE uts.user_id = ? AND uts.status = 'active'
                ORDER BY uts.start_date DESC`,
                [decoded.userId]
            )

            // Calculate current profit for each session
            const sessionsWithProfit = sessions.map((session: any) => {
                // Calculate time elapsed percentage
                const startDate = new Date(session.start_date)
                const endDate = new Date(session.end_date)
                const now = new Date()
                const totalDuration = endDate.getTime() - startDate.getTime()
                const elapsed = now.getTime() - startDate.getTime()
                const progressPercent = Math.min(Math.max(elapsed / totalDuration, 0), 1)

                // Simulate current profit based on time elapsed
                const maxProfit = session.bot_id % 2 === 0 ? 15 : 25 // Different profit ranges for different bots
                const currentProfit = (maxProfit * progressPercent * (Math.random() * 0.5 + 0.75)).toFixed(2)

                return {
                    id: session.id,
                    bot_id: session.bot_id,
                    bot_name: session.bot_name,
                    initial_amount: session.initial_amount,
                    currency: session.currency,
                    start_date: session.start_date,
                    end_date: session.end_date,
                    status: session.status,
                    current_profit: parseFloat(currentProfit),
                    trading_data_url: session.trading_data_url
                }
            })

            return NextResponse.json({ sessions: sessionsWithProfit })
        } finally {
            connection.release()
        }
    } catch (error) {
        console.error("Failed to fetch sessions:", error)
        return NextResponse.json(
            { error: "Failed to fetch trading sessions" },
            { status: 500 }
        )
    }
}