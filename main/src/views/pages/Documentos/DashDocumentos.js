import styled from '@emotion/styled';
import {
    Alert,
    Button,
    ButtonGroup,
    Grid,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import useDrivePicker from 'react-google-drive-picker';
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

const DashDocumentos = ({ id }) => {
    const [proyectos, setProyectos] = useState([]);
    const [direcciones, setDirecciones] = useState([]);
    const [memorias, setMemorias] = useState([]);
    const [agenda, setAgenda] = useState([]);
    const [presupuesto, setPresupuesto] = useState([]);
    const [anticipoGastos, setAnticipoGastos] = useState([]);
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

    const [actividad, setActividad] = useState({
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

    const handleAgregarAgenda = () => {
        navigate(`/actividades/documentos/${id}/agenda`);
    };

    const handleAgregarPresupuesto = () => {
        navigate(`/actividades/documentos/${id}/presupuesto`);
    };

    const handleAgregarAnticipoGastos = () => {
        navigate(`/actividades/documentos/${id}/anticipo-gastos`);
    };

    const handleVerMemoria = () => {
        navigate(`/actividades/documentos/${id}/memoria/detalles`);
    };

    const handleVerAgenda = () => {
        navigate(`/actividades/documentos/${id}/agenda/detalles`);
    };

    const handleVerPresupuesto = () => {
        navigate(`/actividades/documentos/${id}/presupuesto/detalles`);
    };

    const handleVerAnticipoGastos = () => {
        navigate(`/actividades/documentos/${id}/anticipo-gastos/detalles`);
    };

    const handleEditarAgenda = () => {
        navigate(`/actividades/documentos/${id}/agenda/cambios`);
    };

    const handleEditarMemoria = () => {
        navigate(`/actividades/documentos/${id}/memoria/cambios`);
    };

    const handleEditarPresupuesto = () => {
        navigate(`/actividades/documentos/${id}/presupuesto/cambios`);
    };

    const handleEditarAnticipoGastos = () => {
        navigate(`/actividades/documentos/${id}/anticipo-gastos/cambios`);
    };

    useEffect(() => {
        if (authRes) {
            setauthTocken(authRes.access_token);
        }

        const fetchActividades = async () => {
            try {
                const response = await fetch(`${URL}actividades/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setActividad(data);
                } else {
                    console.error('Error al obtener la actividad');
                }
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

        const fetchAgenda = async () => {
            try {
                const response = await fetch(`${URL}api/documentos/${id}/13`);
                if (response.ok) {
                    const data = await response.json();
                    setAgenda(data);
                } else {
                    console.error('Error al obtener la agenda');
                }
            } catch (error) {
                console.error('Error al llamar a la API:', error);
            }
        };

        const fetchPresupuesto = async () => {
            try {
                const response = await fetch(`${URL}api/documentos/${id}/14`);
                if (response.ok) {
                    const data = await response.json();
                    setPresupuesto(data);
                } else {
                    console.error('Error al obtener el presupuesto');
                }
            } catch (error) {
                console.error('Error al llamar a la API:', error);
            }
        };

        const fetchAnticipoGastos = async () => {
            try {
                const response = await fetch(`${URL}api/documentos/${id}/5`);
                if (response.ok) {
                    const data = await response.json();
                    setAnticipoGastos(data);
                } else {
                    console.error('Error al obtener el anticipo de gastos');
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
        fetchPresupuesto();
        fetchAgenda();
        fetchAnticipoGastos();
    }, [id, authRes]);

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
                            value={actividad.fecha_inicio}
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
                            value={actividad.descripcion}
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
                            value={actividad.nombre}
                            InputProps={{
                                readOnly: true,
                            }}
                        />

                        <CustomFormLabel htmlFor="id_proyectos">Proyecto</CustomFormLabel>
                        <Select
                            id="id_proyectos"
                            fullWidth
                            variant="outlined"
                            value={actividad.id_proyectos}
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
                            value={actividad.id_direccion}
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
                <Grid container spacing={3} mb={3}>
                    <Grid item lg={12} md={12}>
                        <Alert severity="info">Información adicional</Alert>
                    </Grid>
                    <Grid item lg={6} md={12}>
                        <CustomFormLabel htmlFor="descripcion">Objetivo general</CustomFormLabel>
                        <CustomTextField
                            id="descripcion"
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                            value={
                                memorias && memorias.contenido && memorias.contenido.objetivo_general
                                    ? memorias.contenido.objetivo_general
                                    : 'Pendiente de ser agregado en la memoria'
                            }
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                    <Grid item lg={6} md={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <CustomFormLabel>Total de participantes</CustomFormLabel>
                                <CustomTextField
                                    variant="outlined"
                                    fullWidth
                                    value={
                                        memorias && memorias.contenido && memorias.contenido.participantes_total
                                            ? memorias.contenido.participantes_total
                                            : 'Pendiente'
                                    }
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <CustomFormLabel>Niños</CustomFormLabel>
                                <CustomTextField
                                    variant="outlined"
                                    fullWidth
                                    value={
                                        memorias && memorias.contenido && memorias.contenido.ninos_participantes
                                            ? memorias.contenido.ninos_participantes
                                            : 'Pendiente'
                                    }
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <CustomFormLabel htmlFor="hombres">Hombres</CustomFormLabel>
                                <CustomTextField
                                    id="hombres"
                                    variant="outlined"
                                    fullWidth
                                    value={
                                        memorias && memorias.contenido && memorias.contenido.hombres_participantes
                                            ? memorias.contenido.hombres_participantes
                                            : 'Pendiente'
                                    }
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <CustomFormLabel htmlFor="mujeres">Mujeres</CustomFormLabel>
                                <CustomTextField
                                    id="mujeres"
                                    variant="outlined"
                                    fullWidth
                                    value={
                                        memorias && memorias.contenido && memorias.contenido.mujeres_participantes
                                            ? memorias.contenido.mujeres_participantes
                                            : 'Pendiente'
                                    }
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
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
                        <br />
                        <Typography variant="body2">
                            {agenda.id == null
                                ? 'Agregar documento'
                                : 'Documento: ' + agenda.estado_documento.nombre}
                        </Typography>
                    </BoxStyled>
                    <br />
                    <ButtonGroup variant="contained" aria-label="outlined primary button group" style={{ width: '100%' }}>
                        <Button
                            onClick={handleAgregarAgenda}
                            style={{ width: '33.33%' }}
                            disabled={agenda.id != null}
                        >
                            Agregar
                        </Button>
                        <Button
                            disabled={agenda.id == null}
                            onClick={handleVerAgenda}
                            style={{ width: '33.33%' }}
                        >
                            Ver
                        </Button>
                        <Button
                            onClick={handleEditarAgenda}
                            style={{ width: '33.33%' }}
                            disabled={agenda.id == null}
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
                        <Typography variant="h6">Presupuesto</Typography>
                        <br />
                        <Typography variant="body2">
                            {presupuesto.id == null
                                ? 'Agregar documento'
                                : 'Documento: ' + presupuesto.estado_documento.nombre}
                        </Typography>
                    </BoxStyled>
                    <br />
                    <ButtonGroup variant="contained" aria-label="outlined primary button group" style={{ width: '100%' }}>
                        <Button
                            onClick={handleAgregarPresupuesto}
                            style={{ width: '33.33%' }}
                            disabled={presupuesto.id != null}
                        >
                            Agregar
                        </Button>
                        <Button
                            onClick={handleVerPresupuesto}
                            style={{ width: '33.33%' }}
                            disabled={presupuesto.id == null}
                        >
                            Ver
                        </Button>
                        <Button
                            onClick={handleEditarPresupuesto}
                            style={{ width: '33.33%' }}
                            disabled={presupuesto.id == null}
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
                        <Typography variant="h6">Anticipo de gastos</Typography>
                        <br />
                        <Typography variant="body2">
                            {anticipoGastos.id == null
                                ? 'Agregar documento'
                                : 'Documento: ' + anticipoGastos.estado_documento.nombre}
                        </Typography>
                    </BoxStyled>
                    <br />
                    <ButtonGroup variant="contained" aria-label="outlined primary button group" style={{ width: '100%' }}>
                        <Button
                            style={{ width: '33.33%' }}
                            onClick={handleAgregarAnticipoGastos}
                            disabled={anticipoGastos.id != null}
                        >
                            Agregar
                        </Button>
                        <Button
                            style={{ width: '33.33%' }}
                            onClick={handleVerAnticipoGastos}
                            disabled={anticipoGastos.id == null}
                        >
                            Ver
                        </Button>
                        <Button
                            style={{ width: '33.33%' }}
                            onClick={handleEditarAnticipoGastos}
                            disabled={anticipoGastos.id == null}
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
