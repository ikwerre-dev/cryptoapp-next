import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
    try {
        const headersList = headers();
        const token = (await headersList).get('authorization')?.split(' ')[1];
        console.log(req)

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        
        // Verify admin status
        const [adminCheck]: any = await pool.query(
            'SELECT is_admin FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (!adminCheck[0]?.is_admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Fetch stats
        const [userCount]: any = await pool.query('SELECT COUNT(*) as count FROM users');
        const [transactionCount]: any = await pool.query('SELECT COUNT(*) as count FROM transactions');
        const [totalVolume]: any = await pool.query(
            'SELECT SUM(amount) as total FROM transactions WHERE status = "completed"'
        );

        return NextResponse.json({
            success: true,
            stats: {
                totalUsers: userCount[0].count,
                totalTransactions: transactionCount[0].count,
                totalVolume: totalVolume[0].total || 0
            }
        });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}