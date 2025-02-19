import { SectionView } from '../../store/models';

export const sidebarConfig = {
    sections: [
        {
            name: 'Cartas sueltas',
            iconClass: 'fa fa-database',
            key: SectionView.SINGLES
        },
        {
            name: 'Boosters',
            iconClass: 'fa fa-cube',
            key: SectionView.BOOSTERS
        },
        {
            name: 'Cajas de Booster',
            iconClass: 'fa fa-cubes',
            key: SectionView.BOOSTER_BOXES
        },
        {
            name: 'Producto Sellado',
            iconClass: 'fa fa-lock',
            key: SectionView.SEALED_PRODUCTS
        }
    ]
};
