export interface PortfolioBarDataset {
    data: number[];
    backgroundColor: string;
    borderColor: string;
    label: string;
}

export interface PortfolioBarData {
    labels: string[];
    datasets: PortfolioBarDataset[];
}