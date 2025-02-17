import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface UserBalance extends RowDataPacket {
    balance: string;
}

export async function POST(req: Request) {
    try {
        const headersList = headers();
        const authHeader = (await headersList).get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        const { amount, currency, address } = await req.json();

        // Check if user has sufficient balance
        const [userBalance] = await pool.query<UserBalance[]>(
            `SELECT ${currency.toLowerCase()}_balance as balance FROM users WHERE id = ?`,
            [decoded.userId]
        );
        
        if (!userBalance.length || parseFloat(userBalance[0].balance) < (parseFloat(amount) + 0.0005)) {
            return NextResponse.json(
                { error: 'Insufficient balance for this transaction' },
                { status: 400 }
            );
        }

        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Create transaction record
            const [result] = await connection.query<ResultSetHeader>(
                `INSERT INTO transactions 
                (user_id, type, currency, amount, fee, status, to_address, description) 
                VALUES (?, 'transfer', ?, ?, ?, 'completed', ?, ?)`,
                [
                    decoded.userId,
                    currency,
                    amount,
                    '0.0005',
                    address,
                    `Sent $ ${amount} in ${currency} to ${address}`
                ]
            );

            // Update user balance
            const balanceColumn = `${currency.toLowerCase()}_balance`;
            await connection.query(
                `UPDATE users 
                SET ${balanceColumn} = ${balanceColumn} - ? 
                WHERE id = ?`,
                [amount, decoded.userId]
            );

            // Create notice
            await connection.query(
                `INSERT INTO account_notices 
                (user_id, type, title, message) 
                VALUES (?, 'transaction', ?, ?)`,
                [
                    decoded.userId,
                    'Transaction Successful',
                    `Successfully sent $ ${amount} in ${currency} to ${address}`
                ]
            );

            await connection.commit();

            return NextResponse.json({
                success: true,
                message: 'Transaction completed successfully',
                transactionId: result.insertId
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Transaction failed:', error);
        return NextResponse.json(
            { error: 'Transaction failed' },
            { status: 500 }
        );
    }
}