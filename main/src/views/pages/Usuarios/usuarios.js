import { Button, Typography } from '@mui/material';
import React from 'react';
import UsuariosPaginationTable from '../../../components/react-tables/pagination/tableUsuarios';
const Usuarios = () => {
    return (
        <div>
            <Typography
                variant="h3"
                component="div"
                align="center"
                sx={{ flexGrow: 1, marginBottom: '5px' }}
            >
                Gestión de Usuarios
            </Typography>
            <Button
                variant="contained"
                color="primary"
                href='/usuarios/crear'
                sx={{ marginBottom: '5px' }}
            >
                Nuevo
            </Button>
            <UsuariosPaginationTable />
        </div>
    );
};
export default Usuarios