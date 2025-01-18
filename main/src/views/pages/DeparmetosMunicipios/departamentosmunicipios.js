import { Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { useState } from 'react';
import DepartamentosPaginationTable from '../../../components/react-tables/pagination/DepartamentosMunicipios/tablaDepartamentos';
import MunicipiosPaginationTable from '../../../components/react-tables/pagination/DepartamentosMunicipios/tableMunicipios';
import VistaMunicipiosDesactivados from '../../../components/react-tables/pagination/DepartamentosMunicipios/tablaMunicipiosDesactivados';
import VistaDepartamentosDesactivados from '../../../components/react-tables/pagination/DepartamentosMunicipios/tablaDepartamentosDesactivados';

const DepartamentosMunicipios = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openModal2, setOpenModal2] = useState(false);

    const handleOpenModal2 = () => {
        setOpenModal2(true);
    };

    const handleCloseModal2 = () => {
        setOpenModal2(false);
        window.location.reload();
    };

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
                Gestión de Departamentos
            </Typography>
            <Button
                variant="contained"
                color="primary"
                href='/DepartamentosMunicipios/crearDepartamentos'
                sx={{ marginBottom: '5px' }}
            >
                Nuevo
            </Button>            <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenModal2}
                sx={{ marginBottom: '5px' }}
            >
                Ver Departamenos Desactivados
            </Button>

            <Dialog open={openModal2} onClose={handleCloseModal2} fullWidth maxWidth="md">
                <DialogTitle>Departamentos Desactivados</DialogTitle>
                <DialogContent>
                    <VistaDepartamentosDesactivados />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal2} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
            <DepartamentosPaginationTable />

            <Typography
                variant="h3"
                component="div"
                align="center"
                sx={{ flexGrow: 1, marginTop: '20px', marginBottom: '5px' }}
            >
                Gestión de Municipios
            </Typography>
            <Button
                variant="contained"
                color="primary"
                href='/DepartamentosMunicipios/crearMunicipios'
                sx={{ marginBottom: '5px' }}
            >
                Nuevo
            </Button>                           <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenModal}
                sx={{ marginBottom: '5px' }}
            >
                Ver Municipios Desactivados
            </Button>

            <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
                <DialogTitle>Municipios Desactivados</DialogTitle>
                <DialogContent>
                    <VistaMunicipiosDesactivados />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
            <MunicipiosPaginationTable />
        </div>
    );
};

export default DepartamentosMunicipios;
