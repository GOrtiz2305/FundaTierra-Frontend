import { Button, Typography } from '@mui/material';
import React from 'react';
import PersonasTable from '../../../components/react-tables/pagination/Personas/tablaPersonas';

const Personas = () => {
    return (
        <div>
            <Typography
                variant="h3"
                component="div"
                align="center"
                sx={{ flexGrow: 1, marginBottom: '5px' }}
            >
                Gestión de personas
            </Typography>
            <Button
                variant="contained"
                color="primary"
                href='/personas/crear'
                sx={{ marginBottom: '5px' }}
            >
                Nuevo
            </Button>
            <PersonasTable />
        </div>
    );
};
export default Personas