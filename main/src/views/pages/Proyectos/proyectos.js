import { Button } from '@mui/material';
import React from 'react';
import ProyectosPaginationTable from '../../react-tables/pagination/tablaProyectos';
const Proyectos = () => {
    return (
        <div>
            <Button variant="contained" color="primary" href='/pages/proyectos/nueva'>
                Nuevo
            </Button>
            <br /> <br />
            <ProyectosPaginationTable />
        </div>
    )
}

export default Proyectos