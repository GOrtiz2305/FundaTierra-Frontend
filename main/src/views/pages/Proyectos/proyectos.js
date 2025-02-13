import { Button, Box, Tabs, Tab } from '@mui/material';
import React, { useState } from 'react';
import ProyectosPaginationTable from '../../../components/react-tables/pagination/tablaProyectos';
import ProyectosDesactivadosPaginationTable from '../../../components/react-tables/pagination/tablaProyectosDesac';

const Proyectos = () => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <div>
            <Button variant="contained" color="primary" href='/proyectos/nueva'>
                Nuevo
            </Button>
            <br /> <br />

            {/* Tabs para cambiar entre proyectos activos y desactivados */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Proyectos Tabs">
                    <Tab label="Proyectos activos" />
                    <Tab label="Proyectos finalizados" />
                </Tabs>
            </Box>

            {/* Mostrar las tablas según la pestaña seleccionada */}
            {tabIndex === 0 && <ProyectosPaginationTable />} {/* Proyectos activos */}
            {tabIndex === 1 && <ProyectosDesactivadosPaginationTable />} {/* Proyectos desactivados */}
        </div>
    );
};

export default Proyectos;
