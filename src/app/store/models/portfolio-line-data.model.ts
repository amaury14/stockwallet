export interface PortfolioLineDataset {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    tension: number;
}

export interface PortfolioLineData {
    labels: string[];
    datasets: PortfolioLineDataset[];
}