import React, { useEffect, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Grid,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import ParentCard from '../../../components/shared/ParentCard';
import { URL } from '../../../../config';
import styled from '@emotion/styled';
import { Box } from '@mui/system';
import useDrivePicker from 'react-google-drive-picker'

const BoxStyled = styled(Box)(() => ({
    padding: '30px',
    transition: '0.1s ease-in',
    // cursor: 'pointer',
    color: 'inherit',
    // '&:hover': {
    //     transform: 'scale(1.03)',
    // },
}));

const DashDocumentos = ({ id }) => {
    const [proyectos, setProyectos] = useState([]);
    const [direcciones, setDirecciones] = useState([]);
    const [memorias, setMemorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [openPicker, authRes] = useDrivePicker();
    const [authTocken, setauthTocken] = useState("");
    const tipoDocumento = 11;

    const handleOpenPicker = () => {
        openPicker({
            clientId: "221911056843-0lvr49sctln4lp64f6u0hb7eki0vu4k0.apps.googleusercontent.com",
            developerKey: "AIzaSyCKfb4fUHYZ9RHu1njWYpj5nZVyDnNJgmA",
            viewId: "DOCS",
            token: authTocken,
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
            // customViews: customViewsArray, // custom view
            callbackFunction: (data) => {
                if (data.action === 'cancel') {
                    console.log('User clicked cancel/close button')
                }
                console.log(data)
            },
        })
    }

    const [data, setData] = useState({
        id: 0,
        fecha_inicio: "",
        nombre: "",
        descripcion: "",
        id_proyectos: "",
        id_direccion: "",
    });

    const handleAgregarMemoria = () => {
        navigate(`/actividades/documentos/${id}/memoria`);
    };

    const handleEditarMemoria = () => {
        navigate(`/actividades/documentos/${id}/memoria/cambios`);
    };

    const handleVerMemoria = () => {
        navigate(`/actividades/documentos/${id}/memoria/detalles`);
    };

    useEffect(() => {
        if (authRes) {
            setauthTocken(authRes.access_token);
        }

        const fetchActividades = async () => {
            try {
                const response = await axios.get(`${URL}actividades/${id}`);
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener actividades:", error);
                setLoading(false);
            }
        };

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

        const fetchDirecciones = async () => {
            try {
                const response = await fetch(`${URL}direcciones`);
                if (response.ok) {
                    const data = await response.json();
                    setDirecciones(data);
                } else {
                    console.error('Error al obtener las direcciones');
                }
            } catch (error) {
                console.error('Error al llamar a la API:', error);
            }
        };

        const fetchMemorias = async () => {
            try {
                const response = await fetch(`${URL}api/documentos/${id}/${tipoDocumento}`);
                if (response.ok) {
                    const data = await response.json();
                    setMemorias(data);
                } else {
                    console.error('Error al obtener las memorias');
                }
            } catch (error) {
                console.error('Error al llamar a la API:', error);
            }
        };

        if (id) {
            fetchActividades();
        }

        fetchProyectos();
        fetchDirecciones();
        fetchMemorias();
    }, [id, authRes]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setData({ ...data, [id]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${URL}actividades/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        fecha_inicio: data.fecha_inicio,
                        nombre: data.nombre,
                        descripcion: data.descripcion,
                        id_proyectos: data.id_proyectos,
                        id_direccion: data.id_direccion,
                    }
                ),
            });

            if (response.ok) {
                alert('Actividad actualizada con éxito');
                navigate('/actividades');
            } else {
                alert('Error al actualizar la actividad');
            }
        } catch (error) {
            console.error('Error al llamar a la API:', error);
            alert('Error al llamar a la API');
        }
    };

    return (
        <>
            <ParentCard title='Datos de la actividad'>
                <Grid container spacing={3} mb={3}>
                    <Grid item lg={6} md={12} sm={12}>
                        <CustomFormLabel htmlFor="fecha_inicio">Fecha</CustomFormLabel>
                        <CustomTextField
                            id="fecha_inicio"
                            type="date"
                            fullWidth
                            value={data.fecha_inicio}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
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
                        <CustomFormLabel htmlFor="nombre">Nombre de la Actividad</CustomFormLabel>
                        <CustomTextField
                            id="nombre"
                            variant="outlined"
                            fullWidth
                            value={data.nombre}
                            InputProps={{
                                readOnly: true,
                            }}
                        />

                        <CustomFormLabel htmlFor="id_proyecto">Proyecto</CustomFormLabel>
                        <Select
                            id="id_proyecto"
                            fullWidth
                            variant="outlined"
                            value={data.id_proyectos}
                            InputProps={{
                                readOnly: true,
                            }}
                        >
                            {proyectos.map((proyecto) => (
                                <MenuItem key={proyecto.id} value={proyecto.id}>
                                    {proyecto.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                        <CustomFormLabel htmlFor="id_direccion">Dirección</CustomFormLabel>
                        <Select
                            id="id_direccion"
                            fullWidth
                            variant="outlined"
                            value={data.id_direccion}
                            InputProps={{
                                readOnly: true,
                            }}
                        >
                            {direcciones.map((direccion) => (
                                <MenuItem key={direccion.id} value={direccion.id}>
                                    {direccion.detalle}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                </Grid>
            </ParentCard>
            <br /> <br />
            <Grid container spacing={3} textAlign="center">
                <Grid item xs={12} sm={6} lg={3}>
                    <BoxStyled
                        onClick={() => { }}
                        sx={{ backgroundColor: 'primary.light', color: 'primary.main' }}
                    >
                        <Typography variant="h6">Agenda</Typography>
                    </BoxStyled>
                    <br />
                    <ButtonGroup variant="contained" aria-label="outlined primary button group" style={{ width: '100%' }}>
                        <Button style={{ width: '33.33%' }}>Agregar</Button>
                        <Button style={{ width: '33.33%' }}>Ver</Button>
                        <Button style={{ width: '33.33%' }}>Editar</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <BoxStyled
                        onClick={() => { }}
                        sx={{ backgroundColor: 'primary.light', color: 'primary.main' }}
                    >
                        <Typography variant="h6">Presupuesto</Typography>
                    </BoxStyled>
                    <br />
                    <ButtonGroup variant="contained" aria-label="outlined primary button group" style={{ width: '100%' }}>
                        <Button style={{ width: '33.33%' }}>Agregar</Button>
                        <Button style={{ width: '33.33%' }}>Ver</Button>
                        <Button style={{ width: '33.33%' }}>Editar</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <BoxStyled
                        onClick={() => { }}
                        sx={{ backgroundColor: 'primary.light', color: 'primary.main' }}
                    >
                        <Typography variant="h6">Anticipo de gastos</Typography>
                    </BoxStyled>
                    <br />
                    <ButtonGroup variant="contained" aria-label="outlined primary button group" style={{ width: '100%' }}>
                        <Button style={{ width: '33.33%' }}>Agregar</Button>
                        <Button style={{ width: '33.33%' }}>Ver</Button>
                        <Button style={{ width: '33.33%' }}>Editar</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <BoxStyled
                        onClick={() => { }}
                        sx={{ backgroundColor: 'primary.light', color: 'primary.main' }}
                    >
                        <Typography variant="h6">Memoria</Typography>
                        <br />
                        <Typography variant="body2">
                            {memorias.id == null
                                ? 'Agregar documento'
                                : 'Documento: ' + memorias.estado_documento.nombre}
                        </Typography>
                    </BoxStyled>
                    <br />
                    <ButtonGroup variant="contained" aria-label="outlined primary button group" style={{ width: '100%' }}>
                        <Button
                            disabled={memorias.id != null}
                            onClick={handleAgregarMemoria}
                            style={{ width: '33.33%' }}
                        >
                            Agregar
                        </Button>
                        <Button
                            disabled={memorias.id == null}
                            onClick={handleVerMemoria}
                            style={{ width: '33.33%' }}
                        >
                            Ver
                        </Button>
                        <Button
                            disabled={memorias.id == null}
                            onClick={handleEditarMemoria}
                            style={{ width: '33.33%' }}
                        >
                            Editar
                        </Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <BoxStyled
                        onClick={() => { }}
                        sx={{ backgroundColor: 'primary.light', color: 'primary.main' }}
                    >
                        <Typography variant="h6">Listado de participantes</Typography>
                    </BoxStyled>
                    <br />
                    <ButtonGroup variant="contained" aria-label="outlined primary button group" style={{ width: '100%' }}>
                        <Button>Agregar</Button>
                        <Button>Ver</Button>
                        <Button>Editar</Button>
                        <Button>Eliminar</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <BoxStyled
                        onClick={() => { }}
                        sx={{ backgroundColor: 'primary.light', color: 'primary.main' }}
                    >
                        <Typography variant="h6">Planilla de pagos en efectivo</Typography>
                    </BoxStyled>
                    <br />
                    <ButtonGroup variant="contained" aria-label="outlined primary button group" style={{ width: '100%' }}>
                        <Button style={{ width: '33.33%' }}>Agregar</Button>
                        <Button style={{ width: '33.33%' }}>Ver</Button>
                        <Button style={{ width: '33.33%' }}>Editar</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <BoxStyled
                        onClick={() => { }}
                        sx={{ backgroundColor: 'primary.light', color: 'primary.main' }}
                    >
                        <Typography variant="h6">Otros</Typography>
                    </BoxStyled>
                    <br />
                    <ButtonGroup variant="contained" aria-label="outlined primary button group" style={{ width: '100%' }}>
                        <Button
                            onClick={() => handleOpenPicker()}
                            style={{ width: '33.33%' }}
                        >
                            Agregar
                        </Button>
                        <Button style={{ width: '33.33%' }}>Ver</Button>
                        <Button style={{ width: '33.33%' }}>Editar</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </>
    );
};

export default DashDocumentos;
