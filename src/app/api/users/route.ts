import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
    try {
        // Verify authentication
        const headersList = headers();
        const authHeader = (await headersList).get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        } catch (error) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        // Fetch user data
        const [users]: any = await pool.query(
            `SELECT 
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
        updated_at
      FROM users 
      WHERE id = ?`,
            [decoded.userId]
        );

        if (users.length === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Get user notices
        const [notices]: any = await pool.query(
            `SELECT id, type, title, message, is_read, created_at 
       FROM account_notices 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 10`,
            [decoded.userId]
        );

        // Get KYC documents
        const [kycDocs]: any = await pool.query(
            `SELECT id, document_type, status, created_at 
       FROM kyc_documents 
       WHERE user_id = ?`,
            [decoded.userId]
        );

        // Get transactions
        const [transactions]: any = await pool.query(
            `SELECT * 
               FROM transactions 
               WHERE user_id = ? ORDER BY id DESC`,
            [decoded.userId]
        );

        // Get wallet addresses
        const [wallets]: any = await pool.query(
            `SELECT id, currency, address, label, is_default 
       FROM wallet_addresses `,
            []
        );

        return NextResponse.json({
            user: {
                ...users[0],
                password: undefined
            },
            notices,
            kycDocuments: kycDocs,
            wallets,
            transactions
        });

    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}