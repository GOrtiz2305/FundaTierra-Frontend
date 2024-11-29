import styled from '@emotion/styled';
import {
    Grid
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { URL } from '../../../../config';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import ParentCard from '../../../components/shared/ParentCard';

const BoxStyled = styled(Box)(() => ({
    padding: '30px',
    transition: '0.1s ease-in',
    // cursor: 'pointer',
    color: 'inherit',
    // '&:hover': {
    //     transform: 'scale(1.03)',
    // },
}));

const ProyectosVer = ({ id }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [data, setData] = useState({
        id: 0,
    nombre: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    presupuesto: "",
    });

    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                const response = await fetch(`${URL}proyectos`);
                if (response.ok) {
                    const data = await response.json();
                    setProyectos(data);
                } else {
                    console.error('Error al obtener los proyectos');
                }
            } catch (error) {
                console.error('Error al llamar a la API:', error);
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

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${URL}proyectos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        nombre: data.nombre,
                        descripcion: data.descripcion,
                        fecha_inicio: data.fecha_inicio,
                        fecha_fin: data.fecha_fin,
                        presupuesto: data.presupuesto,
                    }
                ),
            });

            if (response.ok) {
                alert('Proyecto actualizado con exito');
                navigate('/pages/proyectos');
            } else {
                alert('Error al actualizar el proyecto');
            }
        } catch (error) {
            console.error('Error al llamar a la API:', error);
            alert('Error al llamar a la API');
        }
    };
  // Manejar el cambio en el campo de presupuesto
    const handlePresupuestoChange = (e) => {
    const valor = e.target.value;
    // Solo permitimos que se ingrese un número con máximo 2 decimales
    const regex = /^Q?\s?(\d+(\.\d{0,2})?)?$/;
    if (regex.test(valor)) {
        setData({ ...data, presupuesto: valor.startsWith("Q") ? valor : `Q ${valor}` });
    } };

    return (
        <>
            <ParentCard title='Datos del proyecto'>
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
            
        </>
    );
};

export default ProyectosVer;

