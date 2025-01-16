import React, { useState, useEffect, memo } from 'react';
import {
  MenuItem,
  Select,
  Typography,
  Alert,
  Grid
} from '@mui/material';
import CustomTextField from '../theme-elements/CustomTextField';
import ParentCard from '../../shared/ParentCard';
import { URL } from "../../../../config";
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import esLocale from 'date-fns/locale/es';

const VerMemoriaForm = ({ id }) => {
  const [actividad, setActividad] = useState(null);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  const [memoria, setMemoria] = useState({
    id: 0,
    nombre: '',
    departamento_id: '',
    municipio_id: '',
    fecha_hora: new Date(),
    participantes_total: 0,
    hombres_participantes: 0,
    mujeres_participantes: 0,
    responsable: '',
    cargo: '',
    objetivo_general: '',
    agenda: '',
    desarrollo_agenda: '',
    acuerdos: '',
    observaciones_adicionales: '',
    contenido: {
    },
  });

  const CustomFormLabel = styled((props) => (
    <Typography
      variant="subtitle1"
      fontWeight={600}
      {...props}
      component="label"
      htmlFor={props.htmlFor}
    />
  ))(() => ({
    marginBottom: '5px',
    marginTop: '25px',
    display: 'block',
  }));

  const CustomSelect = styled((props) => <Select {...props} />)(({ }) => ({}));

  useEffect(() => {
    const fetchActividad = async () => {
      try {
        const response = await fetch(`${URL}actividades/${id}`);
        if (response.ok) {
          const data = await response.json();
          setActividad(data);
        } else {
          console.error('Error al obtener la actividad');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    const fetchDepartamentos = async () => {
      try {
        const response = await fetch(`${URL}departamentos`);
        if (response.ok) {
          const data = await response.json();
          setDepartamentos(data);
        } else {
          console.error('Error al obtener los departamentos');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    const fetchMunicipios = async () => {
      try {
        const response = await fetch(`${URL}municipios`);
        if (response.ok) {
          const data = await response.json();
          setMunicipios(data);
        } else {
          console.error('Error al obtener los municipios');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    const fetchMemoria = async () => {
      try {
        const response = await fetch(`${URL}api/documentos/${id}/11`);
        if (response.ok) {
          const data = await response.json();
          setMemoria(data);
        } else {
          console.error('Error al obtener la memoria');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    if (id) {
      fetchMemoria();
    }

    fetchActividad();
    fetchDepartamentos();
    fetchMunicipios();
  }, [id]);

  return (
    <ParentCard title={`Memoria - ${actividad?.nombre ? actividad.nombre : 'Cargando...'
      }`}>
        <Alert severity="info">I. Información general</Alert>
        <Grid container spacing={3} mb={3}>
          <Grid item lg={8} md={12} sm={12}>
            <CustomFormLabel htmlFor="nombre">Nombre del evento</CustomFormLabel>
            <CustomTextField
              id="nombre"
              name="nombre"
              variant="outlined"
              value={memoria.nombre}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item lg={4} md={12} sm={12}>
            <CustomFormLabel htmlFor="fecha_hora">Fecha y hora</CustomFormLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
              <MobileDateTimePicker
                id="fecha_hora"
                name="fecha_hora"
                placeholder="Fecha y hora"
                value={memoria.contenido.fecha_hora}
                disabled
                renderInput={(inputProps) => (
                  <CustomTextField
                    fullWidth
                    variant="outlined"
                    size="medium"
                    inputProps={{ 'aria-label': 'basic date picker' }}
                    {...inputProps}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid container spacing={3} mb={3}>
          <Grid item lg={6} md={12} sm={12}>
            <CustomFormLabel htmlFor="departamento_id">Departamento</CustomFormLabel>
            <CustomSelect
              id="departamento_id"
              name="departamento_id"
              value={memoria.contenido.departamento_id}
              fullWidth
              variant="outlined"
            >
              {departamentos.map((departamento) => (
                <MenuItem key={departamento.id} value={departamento.id}>
                  {departamento.nombre}
                </MenuItem>
              ))}
            </CustomSelect>
          </Grid>
          <Grid item lg={6} md={12} sm={12}>
            <CustomFormLabel htmlFor="municipio_id">Municipio</CustomFormLabel>
            <CustomSelect
              id="municipio_id"
              name="municipio_id"
              value={memoria.contenido.municipio_id}
              fullWidth
              variant="outlined"
            >
              {municipios.map((municipio) => (
                <MenuItem key={municipio.id} value={municipio.id}>
                  {municipio.nombre}
                </MenuItem>
              ))}
            </CustomSelect>
          </Grid>
        </Grid>
        <Grid container spacing={3} mb={3}>
          <Grid item lg={3} md={12} sm={12}>
            <CustomFormLabel htmlFor="participantes_total">Participantes</CustomFormLabel>
            <CustomTextField
              id="participantes_total"
              name="participantes_total"
              variant="outlined"
              value={memoria.contenido.participantes_total}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item lg={3} md={12} sm={12}>
            <CustomFormLabel htmlFor="hombres_participantes">Hombres</CustomFormLabel>
            <CustomTextField
              id="hombres_participantes"
              name="hombres_participantes"
              variant="outlined"
              value={memoria.contenido.hombres_participantes}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item lg={3} md={12} sm={12}>
            <CustomFormLabel htmlFor="mujeres_participantes">Mujeres</CustomFormLabel>
            <CustomTextField
              id="mujeres_participantes"
              name="mujeres_participantes"
              variant="outlined"
              value={memoria.contenido.mujeres_participantes}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item lg={3} md={12} sm={12}>
            <CustomFormLabel htmlFor="ninos_participantes">Niños</CustomFormLabel>
            <CustomTextField
              id="ninos_participantes"
              name="ninos_participantes"
              variant="outlined"
              value={memoria.contenido.ninos_participantes}
              fullWidth
              disabled
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} mb={3}>
          <Grid item lg={6} md={12} sm={12}>
            <CustomFormLabel htmlFor="responsable">Responsable</CustomFormLabel>
            <CustomTextField
              id="responsable"
              name="responsable"
              variant="outlined"
              value={memoria.contenido.responsable}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item lg={6} md={12} sm={12}>
            <CustomFormLabel htmlFor="cargo">Cargo</CustomFormLabel>
            <CustomTextField
              id="cargo"
              name="cargo"
              variant="outlined"
              value={memoria.contenido.cargo}
              fullWidth
              disabled
            />
          </Grid>
        </Grid>
        <Alert severity="info">II. Cuerpo</Alert>
        <CustomFormLabel htmlFor="objetivo_general">Objetivo general</CustomFormLabel>
        <CustomTextField
          id="objetivo_general"
          name="objetivo_general"
          multiline
          rows={4}
          variant="outlined"
          value={memoria.contenido.objetivo_general}
          fullWidth
          disabled
        />
        <CustomFormLabel htmlFor="agenda">Agenda</CustomFormLabel>
        <CustomTextField
          id="agenda"
          name="agenda"
          multiline
          rows={4}
          variant="outlined"
          value={memoria.contenido.agenda}
          fullWidth
          disabled
        />
        <CustomFormLabel htmlFor="desarrollo_agenda">Desarrollo de la agenda</CustomFormLabel>
        <CustomTextField
          id="desarrollo_agenda"
          name="desarrollo_agenda"
          multiline
          rows={4}
          variant="outlined"
          value={memoria.contenido.desarrollo_agenda}
          fullWidth
          disabled
        />
        <CustomFormLabel htmlFor="acuerdos">Acuerdos</CustomFormLabel>
        <CustomTextField
          id="acuerdos"
          name="acuerdos"
          multiline
          rows={4}
          variant="outlined"
          value={memoria.contenido.acuerdos}
          fullWidth
          disabled
        />
        <br /><br />
        <Alert severity="info">Otros</Alert>
        <CustomFormLabel htmlFor="observaciones_adicionales">Observaciones adicionales (Logística, convocatoria, nivel de participación, seguimiento.)</CustomFormLabel>
        <CustomTextField
          id="observaciones_adicionales"
          name="observaciones_adicionales"
          multiline
          rows={4}
          variant="outlined"
          value={memoria.contenido.observaciones_adicionales}
          fullWidth
          disabled
        />
    </ParentCard>
  );
};

export default VerMemoriaForm;
