import {
  IconAperture,
  IconHome
} from '@tabler/icons';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Principal',
  },
  {
    id: uniqueId(),
    title: 'Inicio',
    icon: IconHome,
    href: '/',
    chipColor: 'primary',
  },
  {
    navlabel: true,
    subheader: 'Promotores',
  },
  {
    id: uniqueId(),
    title: 'Actividades',
    icon: IconAperture,
    href: '/actividades',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'Proyectos',
    icon: IconAperture,
    href: '/pages/proyectos',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'lineas Estretegicas',
    icon: IconAperture,
    href: '/pages/LineasEstrategicas',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'Cooperantes',
    icon: IconAperture,
    href: '/pages/Cooperantes',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'Rubros',
    icon: IconAperture,
    href: '/pages/Rubros',
    chipColor: 'secondary',
  },
];

export default Menuitems;
