import { Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { useState } from 'react';
import UsuariosPaginationTable from '../../../components/react-tables/pagination/Usuarios/tableUsuarios';
import UsuariosDesactivados from '../../../components/react-tables/pagination/Usuarios/tableUsuariosDesactivados';
import { Link } from 'react-router-dom';

const Usuarios = () => {
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        window.location.reload();
    };
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
            <br />
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to='/usuarios/crear'
                sx={{ marginBottom: '5px' }}
            >
                Nuevo
            </Button>            <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenModal}
                sx={{ marginBottom: '5px' }}
            >
                Ver Usuarios Desactivados
            </Button>
            <br /><br />
            <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
                <DialogTitle>Usuarios Desactivados</DialogTitle>
                <DialogContent>
                    <UsuariosDesactivados />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
            <UsuariosPaginationTable />
        </div>
    );
};
export default Usuarios