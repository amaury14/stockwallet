export interface PortfolioPieDataset {
    data: number[];
    backgroundColor: string[];
}

export interface PortfolioPieData {
    labels: string[];
    datasets: PortfolioPieDataset[];
    options: unknown;
}