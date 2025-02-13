import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { useState } from 'react';
import RubrosPaginationTable from '../../../components/react-tables/Rubros/tablaRubros';
import RubrosDesactivadoPaginationTable from '../../../components/react-tables/Rubros/tablaRubrosDesactivados';
const Rubros = () => {
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
                Gestión de rubros
            </Typography>
            <Button
                variant="contained"
                color="primary"
                href='/rubros/nueva'
                sx={{ marginBottom: '5px' }}
            >
                Nuevo
            </Button>            <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenModal2}
                sx={{ marginBottom: '5px' }}
            >
                Ver rubros desactivados
            </Button>

            <Dialog open={openModal2} onClose={handleCloseModal2} fullWidth maxWidth="md">
                <DialogTitle>Rubros dataesactivados</DialogTitle>
                <DialogContent>
                    <RubrosDesactivadoPaginationTable />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal2} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
            <RubrosPaginationTable />

           
        </div>
    );
};

export default Rubros;
