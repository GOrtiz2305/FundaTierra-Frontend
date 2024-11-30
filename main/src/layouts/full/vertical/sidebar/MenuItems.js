import {
  IconAperture,
  IconAppWindow,
  IconHome,
  IconPoint,
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
];

export default Menuitems;
