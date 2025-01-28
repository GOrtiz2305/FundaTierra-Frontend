import {
  IconFolder,
  IconHome,
  IconNotes,
  IconMap2,
  IconUsers,
  IconBriefcase,
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
  {
    id: uniqueId(),
    title: 'Documentos',
    icon:   IconNotes,
    href: '/documentos',
    chipColor: 'secondary',
  },
];

export default Menuitems;
