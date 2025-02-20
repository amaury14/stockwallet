import { SectionView } from './section-view.enum';

export interface SectionViewModel {
    disabled: boolean;
    iconClass: string;
    key: SectionView;
    name: string;
}
