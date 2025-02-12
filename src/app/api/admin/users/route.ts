import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
    try {
        const headersList = headers();
        const token = (await headersList).get('authorization')?.split(' ')[1];

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

        const [users]: any = await pool.query(`
            SELECT 
            id,
        email,
        username,
        first_name,
        last_name,
        phone_number,
        country,
        status,
        kyc_status,
        two_factor_enabled,
        last_login,
        login_ip,
        btc_balance,
        eth_balance,
        usdt_balance,
        bnb_balance,
        xrp_balance,
        ada_balance,
        doge_balance,
        sol_balance,
        dot_balance,
        matic_balance,
        link_balance,
        uni_balance,
        avax_balance,
        ltc_balance,
        shib_balance,
        created_at,
        updated_at,
        is_admin
            FROM users 
            WHERE is_admin = 0
            ORDER BY created_at DESC
        `);

        return NextResponse.json({ success: true, users });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}