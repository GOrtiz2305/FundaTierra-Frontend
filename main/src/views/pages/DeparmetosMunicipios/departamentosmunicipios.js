import { Button, Typography } from '@mui/material';
import React from 'react';
import DepartamentosPaginationTable from '../../../components/react-tables/pagination/tablaDepartamentos';
import MunicipiosPaginationTable from '../../../components/react-tables/pagination/tableMunicipios';
const DepartamentosMunicipios = () => {
    return (
        <div>
            <Typography
                variant="h3"
                component="div"
                align="center"
                sx={{ flexGrow: 1, marginBottom: '5px' }}
            >
                Gestión de Departamentos
            </Typography>
            <Button
                variant="contained"
                color="primary"
                href='/DeparmetosMunicipios/crearDepartamentos'
                sx={{ marginBottom: '5px' }}
            >
                Nuevo
            </Button>
            <DepartamentosPaginationTable />

            <Typography
                variant="h3"
                component="div"
                align="center"
                sx={{ flexGrow: 1, marginTop: '20px', marginBottom: '5px' }}
            >
                Gestión de Municipios
            </Typography>
            <Button
                variant="contained"
                color="primary"
                href='/DeparmetosMunicipios/crearMunicipios'
                sx={{ marginBottom: '5px' }}
            >
                Nuevo
            </Button>
            <MunicipiosPaginationTable />
        </div>
    );
};
export default DepartamentosMunicipios