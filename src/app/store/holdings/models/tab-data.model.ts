export enum TabType {
    general = 'general',
    stats = 'stats'
}

export interface TabData {
    index: number;
    title: string;
    tabType: TabType;
}