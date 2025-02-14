import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { useState } from 'react';
import LineasPaginationTable from '../../../components/react-tables/LineasEstrategicas/tablaLineas';
import LineasDesactivadoPaginationTable from '../../../components/react-tables/LineasEstrategicas/tablaLineasDesactivado';
import { Link } from 'react-router-dom';

const LineasEstategicas = () => {
    const [openModal2, setOpenModal2] = useState(false);

    const handleOpenModal2 = () => {
        setOpenModal2(true);
    };

    const handleCloseModal2 = () => {
        setOpenModal2(false);
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
                Gestión de Lineas Estrategicas
            </Typography>
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to='/lineasEstrategicas/nueva'
                sx={{ marginBottom: '5px' }}
            >
                Nuevo
            </Button>            <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenModal2}
                sx={{ marginBottom: '5px' }}
            >
                Ver Lienas Estrategicas Desactivadas
            </Button>

            <Dialog open={openModal2} onClose={handleCloseModal2} fullWidth maxWidth="md">
                <DialogTitle>Lineas Estrategicas Desactivadas</DialogTitle>
                <DialogContent>
                    <LineasDesactivadoPaginationTable />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal2} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
            <LineasPaginationTable />

           
        </div>
    );
};

export default LineasEstategicas;
