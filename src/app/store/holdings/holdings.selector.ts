import { createSelector } from '@ngrx/store';

import { ShareType } from '../models';
import { swSelectors } from '../sw.selectors';
import { getRandomColor } from '../utils';
import { backgroundColors } from './holdings.metadata';
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

export const getAggregatedHoldings = createSelector(
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

            // Convert object to array and calculate average price
            return Object.values(aggregated)?.map(stock => ({
                ...stock,
                ticker: stock.ticker,
                shares: stock.shares,
                avgPrice: stock.shares ? stock.totalCost! / stock.shares! : 0,
                transactions: stock.transactions
            }));
        }
        return [];
    }
);

export const getAggregatedShareTypes = createSelector(
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
            return {
                labels: data.map(item => item.ticker),
                datasets: [
                    {
                        data: data.map(item => item.totalCost!),
                        backgroundColor: data.map((_, index) => backgroundColors[index] ?? getRandomColor())
                    }
                ]
            };
        }
        return null;
    }
);

const getPieChartHoldingsByPercent = createSelector(
    getAggregatedHoldings,
    (data: Holding[]) => {
        if (data?.length) {
            const totalValue = data.reduce((sum, item) => sum + item.totalCost!, 0);
            return {
                labels: data.map(item => item.ticker),
                datasets: [
                    {
                        data: data.map(item => (item.totalCost! * 100) / totalValue),
                        backgroundColor: data.map((_, index) => backgroundColors[index] ?? getRandomColor())
                    }
                ]
            };
        }
        return null;
    }
);

const getPortfolioStats = createSelector(
    getAggregatedHoldings,
    (data: Holding[]) => {
        if (data?.length) {
            return {
                totalValue: data.reduce((sum, item) => sum + item.totalCost!, 0)
            };
        }
        return null;
    }
);

export const holdingsSelectors = {
    getAggregatedHoldings,
    getAggregatedShareTypes,
    getError,
    getFilteredStocks,
    getHoldings,
    getHoldingsByPortfolioId,
    getLoadingState,
    getPieChartHoldingsByAmount,
    getPieChartHoldingsByPercent,
    getPortfolioStats,
    getSelectedHoldings,
    isLoading
};
