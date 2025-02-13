import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { useState } from 'react';
import LineasPaginationTable from '../../../components/react-tables/LineasEstrategicas/tablaLineas';
import LineasDesactivadoPaginationTable from '../../../components/react-tables/LineasEstrategicas/tablaLineasDesactivado';
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
                Gestión de lineas estrategicas
            </Typography>
            <Button
                variant="contained"
                color="primary"
                href='/lineasEstrategicas/nueva'
                sx={{ marginBottom: '5px' }}
            >
                Nuevo
            </Button>            <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenModal2}
                sx={{ marginBottom: '5px' }}
            >
                Ver lineas estrategicas desactivadas
            </Button>

            <Dialog open={openModal2} onClose={handleCloseModal2} fullWidth maxWidth="md">
                <DialogTitle>Lineas estrategicas desactivadas</DialogTitle>
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
