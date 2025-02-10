import { useState } from 'react';

interface UserInvestment {
    id: number;
    package_name: string;
    amount_usd: number;
    currency: string;
    start_date: string;
    end_date: string;
    daily_roi: any;
    auto_compound: boolean;
    duration_days: number;
    min_roi: number;
    max_roi: number;
}

interface InvestmentListProps {
    investments: UserInvestment[];
    limit?: number;
}

export function InvestmentList({ investments, limit }: InvestmentListProps) {
    const [selectedInvestment, setSelectedInvestment] = useState<UserInvestment | null>(null);
    const displayedInvestments = limit ? investments.slice(0, limit) : investments;

    return (
        <>
            <div className="space-y-4">
                {displayedInvestments.map((investment) => {
                    const currentDate = new Date();
                    const startDate = new Date(investment.start_date);
                    const daysPassed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                    const dailyRoi = JSON.parse(investment.daily_roi);
                    const currentStage = daysPassed < dailyRoi.length ?
                        `+${(dailyRoi[daysPassed])}%` :
                        'Completed';
                    let cumulativePercentage = 0;

                    for (let i = 0; i <= daysPassed && i < dailyRoi.length; i++) {
                        cumulativePercentage += dailyRoi[i] * (i + 1);
                    }

                    const todayPercentage = cumulativePercentage;

                    return (
                        <div
                            key={investment.id}
                            className="bg-[#1A1A1A] p-4 rounded-lg cursor-pointer hover:bg-[#242424] transition-colors"
                            onClick={() => setSelectedInvestment(investment)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-medium">{investment.package_name}</h3>
                                    <p className="text-sm text-gray-400">
                                        ${investment.amount_usd.toLocaleString()} {investment.currency}
                                    </p>
                                </div>
                                <div className="text-green-500">
                                    {currentStage}
                                </div>
                            </div>
                            <div className="flex gap-4 text-sm text-gray-400">
                                <div>Start: {new Date(investment.start_date).toLocaleDateString()}</div>
                                <div>End: {new Date(investment.end_date).toLocaleDateString()}</div>
                            </div>
                        </div>
                    )
                }
                )}
            </div>

            {/* Investment Details Modal */}
            {selectedInvestment && (() => {
                const currentDate = new Date();
                const startDate = new Date(selectedInvestment.start_date);
                const daysPassed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                const dailyRoi = JSON.parse(selectedInvestment.daily_roi);
                let cumulativePercentage = 0;
                const initialAmount = selectedInvestment.amount_usd;

                for (let i = 0; i <= daysPassed && i < dailyRoi.length; i++) {
                    cumulativePercentage += dailyRoi[i] * (i + 1);
                }

                let totalAccumulatedAmount = initialAmount;

                for (let i = 0; i <= daysPassed && i < dailyRoi.length; i++) {
                    totalAccumulatedAmount += (totalAccumulatedAmount * dailyRoi[i]);
                }
                const todayPercentage = (cumulativePercentage);

                return (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-[#121212] rounded-[1rem] p-6 max-w-md w-full mx-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">{selectedInvestment.package_name}</h3>
                                <button
                                    onClick={() => setSelectedInvestment(null)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Amount</span>
                                    <span>${selectedInvestment.amount_usd.toLocaleString()} -  {selectedInvestment.currency}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Accumulative Profit</span>
                                    <span>{todayPercentage} %</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Current Value</span>
                                    <span>${totalAccumulatedAmount}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-400">Duration</span>
                                    <span>{selectedInvestment.duration_days} days</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">ROI Range</span>
                                    <span className="text-green-500">{selectedInvestment.min_roi}% - {selectedInvestment.max_roi}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Auto-compound</span>
                                    <span>{selectedInvestment.auto_compound ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Start Date</span>
                                    <span>{new Date(selectedInvestment.start_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">End Date</span>
                                    <span>{new Date(selectedInvestment.end_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </>
    );
}