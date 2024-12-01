import styled from '@emotion/styled';
import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios'; // Asegúrate de importar axios
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { URL } from '../../../../config';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import ParentCard from '../../../components/shared/ParentCard';

const BoxStyled = styled(Box)(() => ({
    padding: '30px',
    transition: '0.1s ease-in',
    color: 'inherit',
}));

const ProyectosVer = ({ id }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [data, setData] = useState({
        nombre: 'Cargando...',
        descripcion: 'Cargando...',
        fecha_inicio: '',
        fecha_fin: '',
        presupuesto: '',
    });

    useEffect(() => {
        const fetchProyectos = async () => {
            setLoading(true); // Mostrar indicador de carga
            try {
                const response = await axios.get(`${URL}proyectos/${id}`);
                if (response.status === 200) {
                    const fetchedData = response.data;
                    setData({
                        nombre: fetchedData.nombre || '',
                        descripcion: fetchedData.descripcion || '',
                        fecha_inicio: fetchedData.fecha_inicio || '',
                        fecha_fin: fetchedData.fecha_fin || '',
                        presupuesto: fetchedData.presupuesto || '',
                    });
                } else {
                    console.error('Error al obtener los proyectos:', response.status);
                }
            } catch (error) {
                console.error('Error al llamar a la API:', error);
            } finally {
                setLoading(false); // Ocultar indicador de carga
            }
        };

        if (id) {
            fetchProyectos();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setData({ ...data, [id]: value });
    };

    const handlePresupuestoChange = (e) => {
        const valor = e.target.value;
        const regex = /^Q?\s?(\d+(\.\d{0,2})?)?$/;
        if (regex.test(valor)) {
            setData({ ...data, presupuesto: valor.startsWith('Q') ? valor : `Q ${valor}` });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${URL}proyectos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                    fecha_inicio: data.fecha_inicio,
                    fecha_fin: data.fecha_fin,
                    presupuesto: data.presupuesto,
                }),
            });
            if (response.ok) {
                alert('Proyecto actualizado con éxito');
                navigate('/proyectos');
            } else {
                console.error('Error al actualizar el proyecto');
                alert('Error al actualizar el proyecto');
            }
        } catch (error) {
            console.error('Error al llamar a la API:', error);
            alert('Error al llamar a la API');
        }
    };

    return (
        <>
            {loading ? (
                <div>Cargando datos del proyecto...</div>
            ) : (
                <ParentCard title="Datos del proyecto">
                    <Grid container spacing={3} mb={3}>
                        <Grid item lg={6} md={12} sm={12}>
                            <CustomFormLabel htmlFor="nombre">Nombre del proyecto</CustomFormLabel>
                            <CustomTextField
                                id="nombre"
                                variant="outlined"
                                fullWidth
                                value={data.nombre}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item lg={6} md={12} sm={12}>
                            <CustomFormLabel htmlFor="descripcion">Descripción</CustomFormLabel>
                            <CustomTextField
                                id="descripcion"
                                multiline
                                rows={4}
                                variant="outlined"
                                fullWidth
                                value={data.descripcion}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item lg={6} md={12} sm={12}>
                            <CustomFormLabel htmlFor="fecha_inicio">Fecha inicio</CustomFormLabel>
                            <CustomTextField
                                id="fecha_inicio"
                                type="date"
                                fullWidth
                                value={data.fecha_inicio}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item lg={6} md={12} sm={12}>
                            <CustomFormLabel htmlFor="fecha_fin">Fecha final</CustomFormLabel>
                            <CustomTextField
                                id="fecha_fin"
                                type="date"
                                fullWidth
                                value={data.fecha_fin}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item lg={6} md={12} sm={12}>
                            <CustomFormLabel htmlFor="presupuesto">Presupuesto</CustomFormLabel>
                            <CustomTextField
                                id="presupuesto"
                                variant="outlined"
                                fullWidth
                                value={data.presupuesto}
                                onChange={handlePresupuestoChange}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                </ParentCard>
            )}
        </>
    );
};

export default ProyectosVer;
