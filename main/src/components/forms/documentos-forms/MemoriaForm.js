import React, { useState, useEffect } from 'react';
import {
  Button,
  FormHelperText,
  MenuItem,
  Select,
  Typography,
  Alert,
  Grid
} from '@mui/material';
import CustomTextField from '../theme-elements/CustomTextField';
import ParentCard from '../../shared/ParentCard';
import { URL } from "../../../../config";
import * as yup from 'yup';
import { useFormik } from 'formik';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import esLocale from 'date-fns/locale/es';

const MemoriaForm = () => {
  const id = useParams();
  const [actividad, setActividad] = useState(null);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const navigate = useNavigate();

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
        const response = await fetch(`${URL}actividades/${id.id}`);
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

    fetchActividad();
    fetchDepartamentos();
    fetchMunicipios();
  }, []);

  const handleSave = async (values) => {
    try {
      const dataEncapsulada = {
        departamento_id: values.departamento_id,
        municipio_id: values.municipio_id,
        fecha_hora: values.fecha_hora,
        participantes_total: values.participantes_total,
        hombres_participantes: values.hombres_participantes,
        mujeres_participantes: values.mujeres_participantes,
        ninos_participantes: values.ninos_participantes,
        objetivo_general: values.objetivo_general,
        agenda: values.agenda,
        desarrollo_agenda: values.desarrollo_agenda,
        acuerdos: values.acuerdos,
        observaciones_adicionales: values.observaciones_adicionales,
      };

      const dataNoEncapsulada = {
        nombre: values.nombre,
        id_actividad: Number(id.id),
        id_tipo: 11,
        id_estado: 1,
      };

      const dataToSend = {
        contenido: {
          ...dataEncapsulada,
        },
        ...dataNoEncapsulada,
      };

      console.log(dataToSend);
      const response = await fetch(`${URL}documentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        <Alert variant="filled" severity="success">
          Actividad creada con éxito
        </Alert>
      } else {
        <Alert variant='filled' severity='error'>
          Error al crear la actividad
        </Alert>
      }

      //Ir a la pagina anterior
      navigate(-1);
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      alert('Error al llamar a la API');
    }
  };

  const validationSchema = yup.object({
    nombre: yup.string().required('El nombre de la actividad es necesario'),
    departamento_id: yup.string().required('Debe de seleccionar un departamento'),
    municipio_id: yup.string().required('Debe de seleccionar un municipio'),
    hombres_participantes: yup.number()
      .typeError('El número de participantes debe ser un valor numérico')
      .required('El número de participantes es necesario'),
    mujeres_participantes: yup.number()
      .typeError('El número de participantes debe ser un valor numérico')
      .required('El número de participantes es necesario'),
    objetivo_general: yup.string().required('El objetivo general es necesario'),
    agenda: yup.string().required('La agenda es necesaria'),
    desarrollo_agenda: yup.string().required('El desarrollo de la agenda es necesario'),
    acuerdos: yup.string().required('Los acuerdos son necesarios'),
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      departamento_id: '',
      municipio_id: '',
      fecha_hora: '',
      participantes_total: '',
      hombres_participantes: '',
      mujeres_participantes: '',
      ninos_participantes: '',
      objetivo_general: '',
      agenda: '',
      desarrollo_agenda: '',
      acuerdos: '',
      observaciones_adicionales: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleSave(values); // Llamar a handleSave con los valores del formulario si es válido
    },
  });

  return (
    <ParentCard title={`Agenda - ${actividad?.nombre ? actividad.nombre : 'Cargando...'
      }`}>
      <form onSubmit={formik.handleSubmit}>
        <Alert severity="info">I. Información general</Alert>
        <Grid container spacing={3} mb={3}>
          <Grid item lg={8} md={12} sm={12}>
            <CustomFormLabel htmlFor="nombre">Nombre del evento</CustomFormLabel>
            <CustomTextField
              id="nombre"
              name="nombre"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.nombre}
              error={formik.touched.nombre && Boolean(formik.errors.nombre)}
              helperText={formik.touched.nombre && formik.errors.nombre}
              onBlur={formik.handleBlur}
              fullWidth
            />
          </Grid>
          <Grid item lg={4} md={12} sm={12}>
            <CustomFormLabel htmlFor="fecha_hora">Fecha y hora</CustomFormLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
              <MobileDateTimePicker
                id="fecha_hora"
                name="fecha_hora"
                placeholder="Fecha y hora"
                value={formik.values.fecha_hora} // Enlazar con el estado de Formik
                onChange={(newValue) => {
                  formik.setFieldValue('fecha_hora', newValue); // Actualizar el estado de Formik
                }}
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
              onChange={formik.handleChange}
              value={formik.values.departamento_id}
              fullWidth
              variant="outlined"
            >
              {departamentos.map((departamento) => (
                <MenuItem key={departamento.id} value={departamento.id}>
                  {departamento.nombre}
                </MenuItem>
              ))}
            </CustomSelect>
            {formik.errors.departamento_id && (
              <FormHelperText error>
                {formik.errors.departamento_id}
              </FormHelperText>
            )}
          </Grid>
          <Grid item lg={6} md={12} sm={12}>
            <CustomFormLabel htmlFor="municipio_id">Municipio</CustomFormLabel>
            <CustomSelect
              id="municipio_id"
              name="municipio_id"
              value={formik.values.municipio_id}
              onChange={formik.handleChange}
              fullWidth
              variant="outlined"
            >
              {municipios.map((municipio) => (
                <MenuItem key={municipio.id} value={municipio.id}>
                  {municipio.nombre}
                </MenuItem>
              ))}
            </CustomSelect>
            {formik.errors.municipio_id && (
              <FormHelperText error>
                {formik.errors.municipio_id}
              </FormHelperText>
            )}

          </Grid>
        </Grid>
        <Grid container spacing={3} mb={3}>
          <Grid item lg={3} md={12} sm={12}>
            <CustomFormLabel htmlFor="participantes_total">Participantes</CustomFormLabel>
            <CustomTextField
              id="participantes_total"
              name="participantes_total"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.participantes_total}
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
              onChange={(e) => {
                const hombres = parseInt(e.target.value || 0, 10); // Convertir a número o 0 si está vacío
                const mujeres = parseInt(formik.values.mujeres_participantes || 0, 10);
                const ninos = parseInt(formik.values.ninos_participantes || 0, 10);
                formik.setFieldValue('hombres_participantes', hombres);
                formik.setFieldValue('participantes_total', hombres + mujeres + ninos);
              }}
              value={formik.values.hombres_participantes}
              error={formik.touched.hombres_participantes && Boolean(formik.errors.hombres_participantes)}
              helperText={formik.touched.hombres_participantes && formik.errors.hombres_participantes}
              onBlur={formik.handleBlur}
              fullWidth
            />
          </Grid>
          <Grid item lg={3} md={12} sm={12}>
            <CustomFormLabel htmlFor="mujeres_participantes">Mujeres</CustomFormLabel>
            <CustomTextField
              id="mujeres_participantes"
              name="mujeres_participantes"
              variant="outlined"
              onChange={(e) => {
                const mujeres = parseInt(e.target.value || 0, 10); // Convertir a número o 0 si está vacío
                const hombres = parseInt(formik.values.hombres_participantes || 0, 10);
                const ninos = parseInt(formik.values.ninos_participantes || 0, 10);
                formik.setFieldValue('mujeres_participantes', mujeres);
                formik.setFieldValue('participantes_total', hombres + mujeres + ninos);
              }}
              value={formik.values.mujeres_participantes}
              error={formik.touched.mujeres_participantes && Boolean(formik.errors.mujeres_participantes)}
              helperText={formik.touched.mujeres_participantes && formik.errors.mujeres_participantes}
              onBlur={formik.handleBlur}
              fullWidth
            />
          </Grid>
          <Grid item lg={3} md={12} sm={12}>
            <CustomFormLabel htmlFor="ninos_participantes">Niños</CustomFormLabel>
            <CustomTextField
              id="ninos_participantes"
              name="ninos_participantes"
              variant="outlined"
              onChange={(e) => {
                const ninos = parseInt(e.target.value || 0, 10); // Convertir a número o 0 si está vacío
                const hombres = parseInt(formik.values.hombres_participantes || 0, 10);
                const mujeres = parseInt(formik.values.mujeres_participantes || 0, 10);
                formik.setFieldValue('ninos_participantes', ninos);
                formik.setFieldValue('participantes_total', hombres + mujeres + ninos);
              }}
              value={formik.values.ninos_participantes}
              error={formik.touched.ninos_participantes && Boolean(formik.errors.ninos_participantes)}
              helperText={formik.touched.ninos_participantes && formik.errors.ninos_participantes}
              onBlur={formik.handleBlur}
              fullWidth
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
          onChange={formik.handleChange}
          value={formik.values.objetivo_general}
          error={formik.touched.objetivo_general && Boolean(formik.errors.objetivo_general)}
          helperText={formik.touched.objetivo_general && formik.errors.objetivo_general}
          onBlur={formik.handleBlur}
          fullWidth
        />
        <CustomFormLabel htmlFor="agenda">Agenda</CustomFormLabel>
        <CustomTextField
          id="agenda"
          name="agenda"
          multiline
          rows={4}
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.agenda}
          error={formik.touched.agenda && Boolean(formik.errors.agenda)}
          helperText={formik.touched.agenda && formik.errors.agenda}
          onBlur={formik.handleBlur}
          fullWidth
        />
        <CustomFormLabel htmlFor="desarrollo_agenda">Desarrollo de la agenda</CustomFormLabel>
        <CustomTextField
          id="desarrollo_agenda"
          name="desarrollo_agenda"
          multiline
          rows={4}
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.desarrollo_agenda}
          error={formik.touched.desarrollo_agenda && Boolean(formik.errors.desarrollo_agenda)}
          helperText={formik.touched.desarrollo_agenda && formik.errors.desarrollo_agenda}
          onBlur={formik.handleBlur}
          fullWidth
        />
        <CustomFormLabel htmlFor="acuerdos">Acuerdos</CustomFormLabel>
        <CustomTextField
          id="acuerdos"
          name="acuerdos"
          multiline
          rows={4}
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.acuerdos}
          error={formik.touched.acuerdos && Boolean(formik.errors.acuerdos)}
          helperText={formik.touched.acuerdos && formik.errors.acuerdos}
          onBlur={formik.handleBlur}
          fullWidth
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
          onChange={formik.handleChange}
          value={formik.values.observaciones_adicionales}
          fullWidth
        />
        <br /><br />
        <div>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Guardar
          </Button>
        </div>
      </form>
    </ParentCard>
  );
};

export default MemoriaForm;
