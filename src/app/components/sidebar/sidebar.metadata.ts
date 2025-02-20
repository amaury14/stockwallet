import { SectionView } from '../../store/models';

export const sidebarConfig = {
    sections: [
        {
            disabled: false,
            name: 'Dashboard',
            iconClass: 'fa fa-database',
            key: SectionView.DASHBOARD
        },
        {
            disabled: false,
            name: 'Portfolios',
            iconClass: 'fa fa-cube',
            key: SectionView.PORTFOLIOS
        },
        {
            disabled: true,
            name: 'Watchlist (coming soon)',
            iconClass: 'fa fa-lock', //fa-cubes
            key: SectionView.WATCHLIST
        },
        {
            disabled: true,
            name: 'Calendar (coming soon)',
            iconClass: 'fa fa-lock',
            key: SectionView.CALENDAR
        },
        {
            disabled: true,
            name: 'Calculators (coming soon)',
            iconClass: 'fa fa-lock',
            key: SectionView.CALCULATORS
        },
        {
            disabled: true,
            name: 'Ai Ideas (coming soon)',
            iconClass: 'fa fa-lock',
            key: SectionView.AI_IDEAS
        },
        {
            disabled: true,
            name: 'News (coming soon)',
            iconClass: 'fa fa-lock',
            key: SectionView.NEWS
        }
    ]
};
