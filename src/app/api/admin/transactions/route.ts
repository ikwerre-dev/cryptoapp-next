import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    try {
        const headersList = headers();
        const authHeader = (await headersList).get("authorization");
        console.log(req)
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, is_admin: boolean };

        if (!decoded.is_admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const connection = await pool.getConnection();
        try {
            const [transactions] = await connection.query(`
                SELECT 
                    t.*,
                    u.email as user_email
                FROM transactions t
                JOIN users u ON t.user_id = u.id
                ORDER BY t.created_at DESC
            `);

            return NextResponse.json({
                success: true,
                transactions
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request) {
    try {
        const headersList = headers();
        const authHeader = (await headersList).get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, is_admin: boolean };

        if (!decoded.is_admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const updates = await req.json();
        const { transaction_id, status } = updates;

        if (!transaction_id || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const connection = await pool.getConnection();
        try {
            await connection.query(
                'UPDATE transactions SET status = ? WHERE id = ?',
                [status, transaction_id]
            );

            return NextResponse.json({ success: true });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to update transaction:", error);
        return NextResponse.json(
            { error: "Failed to update transaction" },
            { status: 500 }
        );
    }
}