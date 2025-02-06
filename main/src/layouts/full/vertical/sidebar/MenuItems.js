import {
  IconAperture,
  IconBriefcase,
  IconFolder,
  IconHome,
  IconMap2,
  IconNotes,
  IconUsers,
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
    subheader: 'ADMINISTRACION',
  },
  {
    id: uniqueId(),
    title: 'Departamentos/Municipios',
    icon: IconMap2,
    href: '/DepartamentosMunicipios',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'Usuarios',
    icon: IconUsers,
    href: '/usuarios',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'Colaboradores',
    icon: IconBriefcase,
    href: '/personas',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'lineas Estretegicas',
    icon: IconAperture,
    href: '/LineasEstrategicas',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'Cooperantes',
    icon: IconAperture,
    href: '/cooperante',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'Rubros',
    icon: IconAperture,
    href: '/rubros',
    chipColor: 'secondary',
  },
  {
    navlabel: true,
    subheader: 'Promotores',
  },
  {
    id: uniqueId(),
    title: 'Proyectos',
    icon: IconFolder,
    href: '/proyectos',
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
