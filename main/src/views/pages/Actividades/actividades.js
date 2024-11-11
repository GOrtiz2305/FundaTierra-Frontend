import React from 'react'
import { Button } from '@mui/material';
import ActividadesPaginationTable from '../../../components/react-tables/pagination/tablaActividades';

const Actividades = () => {
    return (
        <div>
            <Button variant="contained" color="primary" href='/pages/actividades/nueva'>
                Nuevo
            </Button>
            <br /> <br />
            <ActividadesPaginationTable />
        </div>
    )
}

export default Actividades
