import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Cookies from 'js-cookie';

interface InvestmentDetailsProps {
    investment: {
        id: number;
        package_name: string;
        amount_crypto: number;
        amount_usd: number;
        currency: string;
        start_date: string;
        end_date: string;
        current_value_crypto: number;
        current_value_usd: number;
        daily_roi: number[];
        status: string;
    };
    onClose: () => void;
    onWithdraw?: () => void;
}

export function InvestmentDetails({ investment, onClose, onWithdraw }: InvestmentDetailsProps) {
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const totalROI = ((investment.current_value_usd - investment.amount_usd) / investment.amount_usd) * 100;
    const canWithdraw = new Date(investment.end_date) <= new Date();

    const handleWithdraw = async () => {
        if (!canWithdraw) return;
        
        setIsWithdrawing(true);
        try {
            const token = Cookies.get('auth-token');
            const response = await fetch(`/api/investments/${investment.id}/withdraw`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            
            if (onWithdraw) onWithdraw();
            onClose();
        } catch (error) {
            console.error('Withdrawal failed:', error);
        } finally {
            setIsWithdrawing(false);
        }
    };

    const chartData = investment.daily_roi.map((roi, index) => ({
        day: index + 1,
        value: roi
    }));

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#121212] rounded-[1rem] p-6 max-w-2xl w-full mx-4">
                <h3 className="text-xl font-semibold mb-4">{investment.package_name}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#1A1A1A] p-4 rounded-lg">
                        <div className="text-sm text-gray-400">Invested Amount</div>
                        <div className="text-lg">
                            {investment.amount_crypto} {investment.currency}
                            <span className="text-sm text-gray-400 ml-2">
                                (${investment.amount_usd.toFixed(2)})
                            </span>
                        </div>
                    </div>
                    
                    <div className="bg-[#1A1A1A] p-4 rounded-lg">
                        <div className="text-sm text-gray-400">Current Value</div>
                        <div className="text-lg">
                            {investment.current_value_crypto} {investment.currency}
                            <span className="text-sm text-gray-400 ml-2">
                                (${investment.current_value_usd.toFixed(2)})
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="text-sm text-gray-400 mb-2">ROI Performance</div>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#f97316" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                        Total ROI: <span className="text-green-500">+{totalROI.toFixed(2)}%</span>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#242424] rounded-lg"
                        >
                            Close
                        </button>
                        {canWithdraw && (
                            <button
                                onClick={handleWithdraw}
                                disabled={isWithdrawing}
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg"
                            >
                                {isWithdrawing ? 'Processing...' : 'Withdraw'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}