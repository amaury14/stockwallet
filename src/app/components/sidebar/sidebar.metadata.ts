import { SectionView } from '../../store/models';

export const sidebarConfig = {
    sections: [
        {
            disabled: false,
            name: 'Market',
            iconClass: 'pi pi-th-large',
            key: SectionView.MARKET
        },
        {
            disabled: false,
            name: 'Portfolios',
            iconClass: 'pi pi-wallet',
            key: SectionView.PORTFOLIOS
        }//,
        // {
        //     disabled: false,
        //     name: 'Dashboard',
        //     iconClass: 'pi pi-database',
        //     key: SectionView.DASHBOARD
        // },
        // {
        //     disabled: true,
        //     name: 'Watchlist (coming soon)',
        //     iconClass: 'pi pi-lock', //pi pi-search
        //     key: SectionView.WATCHLIST
        // },
        // {
        //     disabled: true,
        //     name: 'Calendar (coming soon)',
        //     iconClass: 'pi pi-lock',
        //     key: SectionView.CALENDAR
        // },
        // {
        //     disabled: true,
        //     name: 'Calculators (coming soon)',
        //     iconClass: 'pi pi-lock',
        //     key: SectionView.CALCULATORS
        // },
        // {
        //     disabled: true,
        //     name: 'Ai Ideas (coming soon)',
        //     iconClass: 'pi pi-lock',
        //     key: SectionView.AI_IDEAS
        // },
        // {
        //     disabled: true,
        //     name: 'News (coming soon)',
        //     iconClass: 'pi pi-lock',
        //     key: SectionView.NEWS
        // }
    ]
};
