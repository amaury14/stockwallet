import { createSelector } from '@ngrx/store';

import { ShareType, StockProfile } from '../models';
import { portfolioSelectors } from '../portfolio/portfolio.selector';
import { swSelectors } from '../sw.selectors';
import { getRandomColor } from '../utils';
import { backgroundColors, tabData } from './holdings.metadata';
import { Holding } from './models';

const holdingsFeatureSelector = createSelector(
    swSelectors.getSWState,
    state => state?.holdings
);

const selectedHoldingSelector = createSelector(
    holdingsFeatureSelector,
    state => state?.data?.[state?.selectedPortfolio]
)

const getError = createSelector(
    selectedHoldingSelector,
    state => state?.error
);

const isLoading = createSelector(
    selectedHoldingSelector,
    state => state?.loading
);

const getLoadingState = createSelector(
    selectedHoldingSelector,
    state => state?.loadingState
);

const getHoldings = createSelector(
    selectedHoldingSelector,
    state => state?.data
);

const getTabs = createSelector(
    selectedHoldingSelector,
    state => state?.tabs ?? []
);

const getSelectedTab = createSelector(
    selectedHoldingSelector,
    state => state?.selectedTab ?? tabData[0]
);

const getStockProfiles = createSelector(
    holdingsFeatureSelector,
    state => state?.stockProfiles
);

const getAggregatedHoldings = createSelector(
    getHoldings,
    (data: Holding[]) => {
        if (data?.length) {
            const aggregated = data.reduce((acc, stock) => {
                if (!acc[stock.ticker]) {
                    acc[stock.ticker] = { ...stock, ticker: stock.ticker, shares: 0, totalCost: 0, transactions: 0 };
                }

                acc[stock.ticker].shares += stock.shares;
                acc[stock.ticker].totalCost! += stock.shares * stock.price;
                acc[stock.ticker].transactions! += 1;

                return acc;
            }, {} as Record<string, Holding>);

            const stocks = Object.values(aggregated)?.map(stock => ({ ...stock }));
            const totalValue = stocks.reduce((sum, item) => sum + item.totalCost!, 0);
            // Convert object to array and calculate average price
            return Object.values(aggregated)?.map(stock => ({
                ...stock,
                ticker: stock.ticker,
                shares: stock.shares,
                avgPrice: stock.shares ? stock.totalCost! / stock.shares! : 0,
                transactions: stock.transactions,
                percent: (stock.totalCost! * 100) / totalValue
            }));
        }
        return [];
    }
);

const getAggregatedShareTypes = createSelector(
    getHoldings,
    (data: Holding[]) => {
        if (data?.length) {
            const totals = data.reduce((acc, asset) => {
                const key = asset.typeDisp;
                const amount = asset.price * asset.shares;
                acc[key!] = (acc[key!] || 0) + amount;
                return acc;
            }, {} as Record<string, number>);

            // Step 2: Compute total portfolio value
            const totalInvestment = Object.values(totals).reduce((sum, val) => sum + val, 0);

            // Step 3: Convert to structured output with percentages
            return Object.entries(totals).map(([label, amount], index) => ({
                label,
                color: backgroundColors[index],
                value: ((amount / totalInvestment) * 100) // Convert to percentage
            })) as ShareType[];
        }
        return [];
    }
);

const getHoldingsByPortfolioId = (portfolioId: string) => createSelector(
    holdingsFeatureSelector,
    state => state?.data[portfolioId]?.data ?? []
);

const getSelectedHoldings = createSelector(
    selectedHoldingSelector,
    state => state?.data?.length
        ? state?.data?.filter(item => item.ticker?.toLowerCase() === state?.selectedHolding?.ticker?.toLowerCase())
        : []
);

const getFilteredStocks = createSelector(
    holdingsFeatureSelector,
    state => state.filterStocks ?? []
)

const getPieChartHoldingsByAmount = createSelector(
    getAggregatedHoldings,
    (data: Holding[]) => {
        if (data?.length) {
            const totalValue = data.reduce((sum, item) => sum + item.totalCost!, 0);
            return {
                labels: data.map(item => `${item.ticker} - ${((item.totalCost! * 100) / totalValue).toFixed(2)}%`),
                datasets: [
                    {
                        data: data.map(item => item.totalCost!),
                        backgroundColor: data.map((_, index) => backgroundColors[index] ?? getRandomColor())
                    }
                ],
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: data?.length <= 5,
                            align: 'center',
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                color: 'white'
                            }
                        }
                    }
                }
            };
        }
        return null;
    }
);

const getPieChartHoldingsBySector = createSelector(
    getAggregatedHoldings,
    getStockProfiles,
    (data: Holding[], profiles: StockProfile[]) => {
        if (data?.length && profiles?.length) {
            const aggregated = data.reduce((acc, stock) => {
                const profile = profiles.find(item => item.symbol === stock.ticker);
                if (!!profile && !!profile.sectorDisp && !acc[profile.sectorDisp]) {
                    acc[profile.sectorDisp] = { ...stock, ...profile!, ticker: stock.ticker, shares: 0, totalCost: 0, transactions: 0 };
                }

                if (!!profile && !!profile.sectorDisp) {
                    acc[profile.sectorDisp].shares += stock.shares;
                    acc[profile.sectorDisp].totalCost! += stock.shares * stock.price;
                    acc[profile.sectorDisp].transactions! += 1;
                }
                return acc;
            }, {} as Record<string, Holding & StockProfile>);

            const stocks = Object.values(aggregated)?.map(stock => ({ ...stock }));
            const totalValue = stocks.reduce((sum, item) => sum + item.totalCost!, 0);
            if (stocks.length) {
                return {
                    labels: stocks.map(item => `${item.sectorDisp} - ${((item.totalCost! * 100) / totalValue).toFixed(2)}%`),
                    datasets: [
                        {
                            data: stocks.map(item => (item.totalCost! * 100) / totalValue),
                            backgroundColor: stocks.map((_, index) => backgroundColors[index] ?? getRandomColor())
                        }
                    ],
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                display: data?.length <= 5,
                                align: 'center',
                                position: 'top',
                                labels: {
                                    usePointStyle: true,
                                    color: 'white'
                                }
                            }
                        }
                    }
                };
            } else {
                const totalETFValue = data.reduce((sum, item) => sum + item.totalCost!, 0);
                return {
                    labels: ['ETF - 100%'],
                    datasets: [
                        {
                            data: [totalETFValue],
                            backgroundColor: [backgroundColors[0]]
                        }
                    ],
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                display: true,
                                align: 'center',
                                position: 'top',
                                labels: {
                                    usePointStyle: true,
                                    color: 'white'
                                }
                            }
                        }
                    }
                };
            }
        }
        return null;
    }
);

const getPortfolioStats = createSelector(
    getAggregatedHoldings,
    portfolioSelectors.getCashAmount,
    (data: Holding[], cashAmount: number) => {
        if (data?.length) {
            const contributionsValue = data.reduce((sum, item) => sum + item.totalCost!, 0);
            return {
                cashValue: cashAmount,
                contributionsValue,
                totalValue: contributionsValue + cashAmount
            };
        }
        return null;
    }
);

const getBarChartPortfolioContributions = createSelector(
    getHoldings,
    (data: Holding[]) => {
        if (data?.length) {
            // Group by month and year
            // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
            const groupedData: { [key: string]: number } = {};

            data.forEach(item => {
                const date = item.dateOfPurchase;
                const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });

                // Calculate total value
                const totalValue = item.price * item.shares;

                // Accumulate values if multiple purchases in the same month
                if (groupedData[monthYear]) {
                    groupedData[monthYear] += totalValue;
                } else {
                    groupedData[monthYear] = totalValue;
                }
            });

            // Convert grouped data to an array and sort by actual date
            const sortedEntries = Object.keys(groupedData)
                .map(monthYear => ({
                    monthYear,
                    totalValue: groupedData[monthYear],
                    timestamp: new Date(monthYear).getTime() // Convert monthYear to timestamp
                }))
                .sort((a, b) => a.timestamp - b.timestamp); // Sort by timestamp (ascending)

            // Extract labels and data after sorting
            const labels = sortedEntries.map(entry => entry.monthYear);
            const datasetData = sortedEntries.map(entry => entry.totalValue);

            // Set chart data
            return {
                labels: labels, // Month and year labels
                datasets: [
                    {
                        label: 'Investment Value per Month',
                        data: datasetData,
                        backgroundColor: backgroundColors[0],
                        borderColor: '#00ACC1'
                    }
                ]
            };
        }
        return null;
    }
);

export const holdingsSelectors = {
    getAggregatedHoldings,
    getAggregatedShareTypes,
    getBarChartPortfolioContributions,
    getError,
    getFilteredStocks,
    getHoldings,
    getHoldingsByPortfolioId,
    getLoadingState,
    getPieChartHoldingsByAmount,
    getPieChartHoldingsBySector,
    getPortfolioStats,
    getSelectedHoldings,
    getSelectedTab,
    getStockProfiles,
    getTabs,
    isLoading
};
