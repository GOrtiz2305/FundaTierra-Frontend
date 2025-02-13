import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

const DepartamentosMunicipios = Loadable(lazy(() => import('../views/pages/DeparmetosMunicipios/departamentosmunicipios')));
const Usuarios = Loadable(lazy(() => import('../views/pages/Usuarios/usuarios')));
const Personas = Loadable(lazy(() => import('../views/pages/personas/personas')));
const Actividades = Loadable(lazy(() => import('../views/pages/Actividades/actividades')));
const ActividadesDocumentos = Loadable(lazy(() => import('../views/pages/Actividades/actividadesDocumentos')));
const Memoria = Loadable(lazy(() => import('../views/pages/Documentos/Memoria')));
const EditarMemoria = Loadable(lazy(() => import('../views/pages/Documentos/EditarMemoria')));
const VerMemoria = Loadable(lazy(() => import('../views/pages/Documentos/VerMemoria')));
const ProyectosVer = Loadable(lazy(() => import('../views/pages/Documentos/ProyectosVer')));
const Agenda = Loadable(lazy(() => import('../views/pages/Documentos/agenda')));
const Presupuesto = Loadable(lazy(() => import('../views/pages/Documentos/Presupuesto')));
const VerAgenda = Loadable(lazy(() => import('../views/pages/Documentos/VerAgenda')));
const EditarAgenda = Loadable(lazy(() => import('../views/pages/Documentos/EditarAgenda')));
const VerPresupuesto = Loadable(lazy(() => import('../views/pages/Documentos/VerPresupuesto')));
const EditarPresupuesto = Loadable(lazy(() => import('../views/pages/Documentos/EditarPresupuesto'))); 
const AnticipoGastos = Loadable(lazy(() => import('../views/pages/Documentos/AnticipoGastos')));
const VerAnticipoGastos = Loadable(lazy(() => import('../views/pages/Documentos/VerAnticipoGastos')));
const EditarAnticipoGasto = Loadable(lazy (() => import('../views/pages/Documentos/EditarAnticipoGasto'))) ;
const Proyectos = Loadable (lazy(() => import('../views/pages/Proyectos/proyectos')));
// /* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const ModernDash = Loadable(lazy(() => import('../views/dashboard/Modern')));
const DepartamentosCrear = Loadable(lazy(() => import('../views/pages/DeparmetosMunicipios/departamentoscrear')));
const DepartamentosEditar = Loadable(lazy(() => import('../views/pages/DeparmetosMunicipios/departamentoseditar')));
const MunicipiosCrear = Loadable(lazy(() => import('../views/pages/DeparmetosMunicipios/municipioscrear')));
const MunicipiosEditar = Loadable(lazy(() => import('../views/pages/DeparmetosMunicipios/municipioseditar')));
const PersonasCrear = Loadable(lazy(() => import('../views/pages/personas/personasCrear')));
const PersonasEditar = Loadable(lazy(() => import('../views/pages/personas/personasEditar')));
const UsuariosCrear = Loadable(lazy(() => import('../views/pages/Usuarios/usuariosCrear')));
const UsuariosEditar = Loadable(lazy(() => import('../views/pages/Usuarios/usuariosEditar')));
const ActividadesEditar = Loadable(lazy(() => import('../views/pages/Actividades/actividadesEditar')));
const ActividadesCrear = Loadable(lazy(() => import('../views/pages/Actividades/actividadesCrear')));
const ProyectosEditar = Loadable(lazy(() => import('../views/pages/Proyectos/proyectosEditar')));
const ProyectosCrear = Loadable(lazy(() => import('../views/pages/Proyectos/proyectosCrear')));
const Cooperante = Loadable(lazy(()=> import('../views/pages/Cooperantes/cooperantes')));
const CooperanteCrear = Loadable(lazy(()=> import ('../views/pages/Cooperantes/cooperanteCrear')));
const CooperanteEditar = Loadable(lazy(()=> import ('../views/pages/Cooperantes/cooperanteEditar')));
const LineasEstrategicas = Loadable (lazy (() => import('../views/pages/LineasEstrategicas/lineasEstrategicas')));
const LineasEstrategicasCrear = Loadable(lazy(()=> import ('../views/pages/LineasEstrategicas/lineasEstrategicasCrear')));
const LineasEstrategicasEditar = Loadable(lazy(()=> import ('../views/pages/LineasEstrategicas/lineasEstrategicasEditar')));
const Rubro = Loadable (lazy(()=> import('../views/pages/Rubros/rubros')));
const RubroCrear = Loadable(lazy(()=> import ('../views/pages/Rubros/rubroCrear')));
const RubroEditar = Loadable(lazy(()=> import ('../views/pages/Rubros/rubroEditar')));
// authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', exact: true, element: <ModernDash /> },
      { path: '/DepartamentosMunicipios', element: <DepartamentosMunicipios/> },
      { path: '/DepartamentosMunicipios/crearDepartamentos', element: <DepartamentosCrear/> },
      { path: '/DepartamentosMunicipios/editarDepartamentos/:id', element: <DepartamentosEditar/> },
      { path: '/DepartamentosMunicipios/crearMunicipios', element: <MunicipiosCrear/> },
      { path: '/DepartamentosMunicipios/editarMunicipios/:id', element: <MunicipiosEditar/> },
      { path: '/usuarios', element: <Usuarios /> },
      { path: '/usuarios/crear', element: <UsuariosCrear /> },
      { path: '/usuarios/editar/:id', element: <UsuariosEditar /> },
      { path: '/personas', element: <Personas /> },
      { path: '/personas/crear', element: <PersonasCrear /> },
      { path: '/personas/editar/:id', element: <PersonasEditar /> },
      { path: '/actividades', element: <Actividades /> },
      { path: '/actividades/nueva', element: <ActividadesCrear /> },
      { path: '/actividades/cambios/:id', element: <ActividadesEditar /> },
      { path: '/actividades/documentos/:id', element: <ActividadesDocumentos /> },
      { path: '/actividades/documentos/:id/memoria', element: <Memoria /> },
      { path: '/actividades/documentos/:id/memoria/cambios', element: <EditarMemoria /> },
      { path: '/actividades/documentos/:id/memoria/detalles', element: <VerMemoria /> },
      { path: '/actividades/documentos/:id/agenda', element: <Agenda /> },
      { path: '/actividades/documentos/:id/agenda/detalles', element: <VerAgenda /> },
      { path: '/actividades/documentos/:id/agenda/cambios', element: <EditarAgenda />},
      { path: '/actividades/documentos/:id/presupuesto', element: <Presupuesto /> },
      { path: '/actividades/documentos/:id/presupuesto/cambios', element: <EditarPresupuesto />},
      { path: '/actividades/documentos/:id/presupuesto/detalles', element: <VerPresupuesto/>},
      { path: '/actividades/documentos/:id/anticipo-gastos', element: <AnticipoGastos /> },
      { path: '/actividades/documentos/:id/anticipo-gastos/cambios', element: <EditarAnticipoGasto />},
      { path: '/actividades/documentos/:id/anticipo-gastos/detalles', element: <VerAnticipoGastos /> },
      { path: '/proyectos', element: <Proyectos/>},
      { path: '/proyectos/nueva', element: <ProyectosCrear /> },
      { path: '/proyectos/cambios/:id', element: <ProyectosEditar /> },
      { path: '/proyectos/detalle/:id', element:<ProyectosVer/>},
      { path: '/cooperante', element: <Cooperante />},
      { path: '/cooperante/nueva', element: <CooperanteCrear /> },
      { path: '/cooperante/cambios/:id', element: <CooperanteEditar /> },
      { path: '/lineasEstrategicas', element: <LineasEstrategicas/>},
      { path: '/lineasEstrategicas/nueva', element: <LineasEstrategicasCrear /> },
      { path: '/lineasEstrategicas/cambios/:id', element: <LineasEstrategicasEditar /> },
      { path: '/rubros', element: <Rubro /> },
      { path: '/rubros/nueva', element: <RubroCrear /> },
      { path: '/rubros/cambios/:id', element: <RubroEditar /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/404', element: <Error /> },
      { path: '/auth/login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
