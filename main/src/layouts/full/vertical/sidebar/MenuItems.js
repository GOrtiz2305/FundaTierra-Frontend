import {
  IconAperture,
  IconAppWindow,
  IconPoint,
} from '@tabler/icons';

import { uniqueId } from 'lodash';

const Menuitems = [
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
    title: 'Frontend pages',
    icon: IconAppWindow,
    href: '/frontend-pages/',
    children: [
      {
        id: uniqueId(),
        title: 'Homepage',
        icon: IconPoint,
        href: '/frontend-pages/homepage',
      },
      {
        id: uniqueId(),
        title: 'About Us',
        icon: IconPoint,
        href: '/frontend-pages/about',
      },
      {
        id: uniqueId(),
        title: 'Blog',
        icon: IconPoint,
        href: '/frontend-pages/blog',
      },
      {
        id: uniqueId(),
        title: 'Blog Details',
        icon: IconPoint,
        href: '/frontend-pages/blog/Blog_1',
      },
      {
        id: uniqueId(),
        title: 'Contact',
        icon: IconPoint,
        href: '/frontend-pages/contact',
      },
      {
        id: uniqueId(),
        title: 'Portfolio',
        icon: IconPoint,
        href: '/frontend-pages/portfolio',
      },
      {
        id: uniqueId(),
        title: 'Pricing',
        icon: IconPoint,
        href: '/frontend-pages/pricing',
      },
    ],
  },
];

export default Menuitems;
