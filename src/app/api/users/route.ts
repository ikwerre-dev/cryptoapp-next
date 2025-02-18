import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    country: string;
    status: string;
    kyc_status: string;
    two_factor_enabled: boolean;
    last_login: Date;
    login_ip: string;
    btc_balance: string;
    eth_balance: string;
    usdt_balance: string;
    bnb_balance: string;
    xrp_balance: string;
    ada_balance: string;
    doge_balance: string;
    sol_balance: string;
    dot_balance: string;
    matic_balance: string;
    link_balance: string;
    uni_balance: string;
    avax_balance: string;
    ltc_balance: string;
    shib_balance: string;
    created_at: Date;
    updated_at: Date;
    is_admin: boolean;
}

interface Notice extends RowDataPacket {
    id: number;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: Date;
}

interface KycDocument extends RowDataPacket {
    id: number;
    document_type: string;
    status: string;
    created_at: Date;
}

interface Transaction extends RowDataPacket {
    id: number;
    user_id: number;
    type: string;
    amount: string;
    currency: string;
    status: string;
    created_at: Date;
}

interface Wallet extends RowDataPacket {
    id: number;
    currency: string;
    address: string;
    label: string;
    is_default: boolean;
}
export async function GET() {
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
            console.error(error)
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        // Fetch user data
        const [users] = await pool.query<User[]>(
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
        updated_at,
        is_admin
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
        const [notices] = await pool.query<Notice[]>(
            `SELECT id, type, title, message, is_read, created_at 
       FROM account_notices 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 10`,
            [decoded.userId]
        );

        // Get KYC documents
        const [kycDocs] = await pool.query<KycDocument[]>(
            `SELECT id, document_type, status, created_at 
       FROM kyc_documents 
       WHERE user_id = ?`,
            [decoded.userId]
        );

        // Get transactions
        const [transactions] = await pool.query<Transaction[]>(
            `SELECT * 
               FROM transactions 
               WHERE user_id = ? ORDER BY id DESC`,
            [decoded.userId]
        );

        // Get wallet addresses
        const [wallets] = await pool.query<Wallet[]>(
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