import {
  IconFolder,
  IconHome,
  IconNotes,
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
    title: 'Proyectos',
    icon: IconFolder,
    href: '/pages/proyectos',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'Actividades',
    icon:   IconNotes,
    href: '/actividades',
    chipColor: 'secondary',
  },
];

export default Menuitems;
