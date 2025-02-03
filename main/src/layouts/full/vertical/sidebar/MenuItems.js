import {
  IconAperture,
  IconBriefcase,
  IconFolder,
  IconHome,
  IconMap2,
  IconNotes,
  IconUsers,
  IconUserPlus,
  IconLine,
  IconList,
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
    title: 'Lineas estrategicas',
    icon: IconLine,
    href: '/lineasEstregicas/nueva',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'Cooperantes',
    icon: IconUserPlus,
    href: '/cooperante/nueva',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'Rubros',
    icon: IconList,
    href: '/Rubros/nueva',
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
