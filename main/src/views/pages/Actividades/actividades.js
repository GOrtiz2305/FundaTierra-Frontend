import { Button, Box, Tabs, Tab } from '@mui/material';
import React, { useState } from 'react';
import ActividadesPaginationTable from '../../../components/react-tables/pagination/tablaActividades';
import ActividadesPaginationTable2 from '../../../components/react-tables/pagination/tablaActividadesPendientes';
import ActividadesPaginationTable3 from '../../../components/react-tables/pagination/tablaActividadesFinalizadas';
import { Link } from 'react-router-dom';

const Actividades = () => {

    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <div>
            <Button variant="contained" color="primary" component={Link} to='/actividades/nueva'>
                Nuevo
            </Button>
            <br /> <br />

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Actividades Tabs">
                    <Tab label="Actividades en Progreso" />
                    <Tab label="Actividades en Revision" />
                    <Tab label="Actividades Finalizadas" />
                </Tabs>
            </Box>

            {tabIndex === 0 && <ActividadesPaginationTable />} 
            {tabIndex === 1 && <ActividadesPaginationTable2 />}
            {tabIndex === 2 && <ActividadesPaginationTable3 />}
        </div>
    )
}

export default Actividades
