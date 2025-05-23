import { tabKeys } from '../key-string.store';
import { InvestmentType, TabData, TabType } from './models';

export const backgroundColors = [
    '#42A5F5', // Blue
    '#66BB6A', // Green
    '#FFA726', // Orange
    '#AB47BC', // Purple
    '#EC407A', // Pink
    '#FF7043', // Red-Orange
    '#29B6F6', // Light Blue
    '#9CCC65', // Light Green
    '#FFCA28', // Yellow
    '#8D6E63', // Brown
    '#26A69A', // Teal
    '#7E57C2', // Deep Purple
    '#D4E157', // Lime Green
    '#FF8A65', // Light Red
    '#78909C'  // Grayish Blue
];

export const tabData: TabData[] = [
    {
        index: 0,
        title: tabKeys.GENERAL_TITLE,
        tabType: TabType.general
    },
    {
        index: 1,
        title: tabKeys.STATS_TITLE,
        tabType: TabType.stats
    }
];

export const investmentTypes: InvestmentType[] = [
    { key: 'long_term', name: 'Long Term' },
    { key: 'dividends', name: 'Dividends' },
    { key: 'speculative', name: 'Speculative' }
];