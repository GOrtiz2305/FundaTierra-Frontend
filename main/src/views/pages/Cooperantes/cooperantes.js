import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { useState } from 'react';
import CooperantePaginationTable from '../../../components/react-tables/Cooperantes/tablaCooperantes';
import CooperantesDesactivadoPaginationTable from '../../../components/react-tables/Cooperantes/tablaCooperatesDesactivado';
const Cooperantes = () => {
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
                Gestión de Cooperantes
            </Typography>
            <Button
                variant="contained"
                color="primary"
                href='/cooperante/nueva'
                sx={{ marginBottom: '5px' }}
            >
                Nuevo
            </Button>            <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenModal2}
                sx={{ marginBottom: '5px' }}
            >
                Ver Cooperantes Desactivadas
            </Button>

            <Dialog open={openModal2} onClose={handleCloseModal2} fullWidth maxWidth="md">
                <DialogTitle>Cooperantes Desactivados</DialogTitle>
                <DialogContent>
                    <CooperantesDesactivadoPaginationTable />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal2} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
            <CooperantePaginationTable />

           
        </div>
    );
};

export default Cooperantes;
