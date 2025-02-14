import { Button, Typography} from '@mui/material';
import React from 'react';
import PersonasTable from '../../../components/react-tables/pagination/Personas/tablaPersonas';
import { Link } from 'react-router-dom';

const Personas = () => {
    return (
        <div>
            <Typography
                variant="h3"
                component="div"
                align="center"
                sx={{ flexGrow: 1, marginBottom: '5px' }}
            >
                Gestión de Personas
            </Typography>
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to='/personas/crear'
                sx={{ marginBottom: '5px' }}
            >
                Nuevo
            </Button>
            <PersonasTable />
        </div>
    );
};
export default Personas