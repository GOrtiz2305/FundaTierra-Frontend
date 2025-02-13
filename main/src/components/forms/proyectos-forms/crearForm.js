import {
  Alert,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';

import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as yup from 'yup';
import { URL } from "../../../../config";
import ParentCard from '../../shared/ParentCard';
import CustomTextField from '../theme-elements/CustomTextField';

const ProyectosOrdinaryForm = () => {

  const id = useParams();
  const navigate = useNavigate();
  const [lineasEstrategicasOptions, setLineasEstrategicasOptions] = useState([]);
  const [cooperantesOptions, setCooperantesOptions] = useState([]);
  const [conversionRate, setConversionRate] = useState(0.11);
  const CustomFormLabel = styled((props) => (
    <Typography variant="subtitle1" fontWeight={600} {...props} component="label" />
  ))(() => ({
    marginBottom: '5px',
    marginTop: '25px',
    display: 'block',
  }));

  const validationSchema = yup.object({
    nombre: yup.string().required('El nombre del proyecto es necesario'),
    alias: yup.string().required('El alias es necesario'),
    descripcion: yup.string().required('La descripción es necesaria'),
    fecha_inicio: yup.date().required('La fecha de inicio es necesaria'),
    fecha_fin: yup.date().min(yup.ref('fecha_inicio'), 'La fecha final debe ser posterior a la fecha de inicio').required('La fecha final es necesaria'),
    presupuesto_quetzales: yup.number().positive('Debe ser un número positivo').required('El presupuesto en quetzales es necesario'),
  });
  useEffect(() => {
    const fetchLineasEstrategicas = async () => {
      try {
        const response = await fetch(`${URL}lineasEstrategicas`);
        if (response.ok) {
          const data = await response.json();
          setLineasEstrategicasOptions(data);
        } else {
          console.error('Error al obtener las lineas estrategicas');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };
    const fetchCooperantes = async () => {
      try {
        const response = await fetch(`${URL}cooperante`);
        if (response.ok) {
          const data = await response.json();
          setCooperantesOptions(data);
        } else {
          console.error('Error al obtener las lineas estrategicas');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };




    fetchLineasEstrategicas();
    fetchCooperantes();
  }, []);

  const formik = useFormik({
    initialValues: {
      nombre: '',
      alias: '',
      cooperantes: [],
      lineas_estrategicas: [],
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: '',
      presupuesto_quetzales: '',
      presupuesto_euros: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      handleSave(values);
    },
  });
  const handleSave = async (values) => {
    try {
      // Se guarda el documento principal
      const responseProyecto = await fetch(`${URL}proyectos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, id_usuario: 3, id_estado: 1 }),
      });

      const proyectoData = await responseProyecto.json();
      const idProyecto = proyectoData.id;

      //Se guardan los rubros
      const LineasEstrategicasPorEnviar = formik.values.lineas_estrategicas.map((idLineas) => ({
        id_linea_estrategica: Number(idLineas),
        id_proyectos: Number(idProyecto),
      }));
      const responseLineas = await fetch(`${URL}proyectoLinea`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(LineasEstrategicasPorEnviar),
      });

      const CooperantesPorEnviar = formik.values.cooperantes.map((idCooperante) => ({
        id_cooperante: Number(idCooperante),
        id_proyecto: Number(idProyecto),
      }));
      const responseCooperantes = await fetch(`${URL}proyectoCooperantes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(CooperantesPorEnviar),
      });

      if (responseProyecto.ok && responseCooperantes.ok && responseLineas.ok) {
        <Alert variant="filled" severity="success">
          Proyecto creado con éxito
        </Alert>
      } else {
        <Alert variant='filled' severity='error'>
          Error al crear el proyecto
        </Alert>
      }
      //Ir a la pagina anterior
      navigate(-1);
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      alert('Error al llamar a la API');
    }
  };
  const handleQuetzalesChange = (event) => {
    const valueInQuetzales = event.target.value;
    formik.setFieldValue('presupuesto_quetzales', valueInQuetzales);

    if (!isNaN(valueInQuetzales) && valueInQuetzales !== '') {
      const valueInEuros = (valueInQuetzales * conversionRate).toFixed(2);
      formik.setFieldValue('presupuesto_euros', valueInEuros);
    } else {
      formik.setFieldValue('presupuesto_euros', '');
    }
  };
  return (
    <ParentCard title="Formulario de proyectos - información general">
      <form onSubmit={formik.handleSubmit} autoComplete="on">
        <CustomFormLabel htmlFor="nombre">Nombre del proyecto</CustomFormLabel>
        <CustomTextField
          id="nombre"
          name="nombre"
          variant="outlined"
          fullWidth
          autoComplete="project-name"
          value={formik.values.nombre}
          onChange={formik.handleChange}
          error={formik.touched.nombre && Boolean(formik.errors.nombre)}
          helperText={formik.touched.nombre && formik.errors.nombre}
        />

        <CustomFormLabel htmlFor="alias">Alias</CustomFormLabel>
        <CustomTextField
          id="alias"
          name="alias"
          variant="outlined"
          fullWidth
          autoComplete="project-alias"
          value={formik.values.alias}
          onChange={formik.handleChange}
          error={formik.touched.alias && Boolean(formik.errors.alias)}
          helperText={formik.touched.alias && formik.errors.alias}
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomFormLabel htmlFor="cooperantes">Cooperantes</CustomFormLabel>
            <FormControl fullWidth>
              <InputLabel id="cooperantes-label">Seleccione los cooperantes</InputLabel>
              <Select
                labelId="cooperantes-label"
                id="cooperantes"
                name="cooperantes"
                multiple
                value={formik.values.cooperantes}
                onChange={formik.handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Seleccione los cooperantes" />}
                renderValue={(selected) => (
                  <div>
                    {selected.map((value) => {
                      const cooperante = cooperantesOptions.find(coop => coop.id === value);
                      return cooperante ? <Chip key={value} label={cooperante.nombre_donante} /> : null;

                    })}
                  </div>
                )}
              >
                {cooperantesOptions.map((cooperante) => (
                  <MenuItem key={cooperante.id} value={cooperante.id}>
                    {cooperante.nombre_donante}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <CustomFormLabel htmlFor="lineas_estrategicas">Líneas estratégicas</CustomFormLabel>
            <FormControl fullWidth>
              <InputLabel id="lineas-estrategicas-label">Seleccione las líneas estratégicas</InputLabel>
              <Select
                labelId="lineas-estrategicas-label"
                id="lineas_estrategicas"
                name="lineas_estrategicas"
                multiple
                value={formik.values.lineas_estrategicas}
                onChange={formik.handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Seleccione las líneas estratégicas" />}
                renderValue={(selected) => (
                  <div>
                    {selected.map((value) => {
                      const linea = lineasEstrategicasOptions.find(lin => lin.id === value);
                      return linea ? <Chip key={value} label={linea.nombre} /> : null;

                    })}
                  </div>
                )}
              >
                {lineasEstrategicasOptions.map((linea) => (
                  <MenuItem key={linea.id} value={linea.id}>
                    {linea.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <CustomFormLabel htmlFor="descripcion">Descripción</CustomFormLabel>
        <CustomTextField
          id="descripcion"
          name="descripcion"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          autoComplete="description"
          value={formik.values.descripcion}
          onChange={formik.handleChange}
          error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
          helperText={formik.touched.descripcion && formik.errors.descripcion}
        />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomFormLabel htmlFor="fecha_inicio">Fecha de inicio</CustomFormLabel>
            <TextField
              id="fecha_inicio"
              name="fecha_inicio"
              type="date"
              variant="outlined"
              fullWidth
              autoComplete="start-date"
              value={formik.values.fecha_inicio}
              onChange={formik.handleChange}
              error={formik.touched.fecha_inicio && Boolean(formik.errors.fecha_inicio)}
              helperText={formik.touched.fecha_inicio && formik.errors.fecha_inicio}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={6}>
            <CustomFormLabel htmlFor="fecha_fin">Fecha de fin</CustomFormLabel>
            <TextField
              id="fecha_fin"
              name="fecha_fin"
              type="date"
              variant="outlined"
              fullWidth
              autoComplete="end-date"
              value={formik.values.fecha_fin}
              onChange={formik.handleChange}
              error={formik.touched.fecha_fin && Boolean(formik.errors.fecha_fin)}
              helperText={formik.touched.fecha_fin && formik.errors.fecha_fin}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomFormLabel htmlFor="presupuesto_quetzales">Presupuesto en quetzales</CustomFormLabel>
            <TextField
              id="presupuesto_quetzales"
              name="presupuesto_quetzales"
              type="number"
              variant="outlined"
              fullWidth
              autoComplete="budget-gtq"
              value={formik.values.presupuesto_quetzales}
              onChange={handleQuetzalesChange}
              error={formik.touched.presupuesto_quetzales && Boolean(formik.errors.presupuesto_quetzales)}
              helperText={formik.touched.presupuesto_quetzales && formik.errors.presupuesto_quetzales}
            />
          </Grid>

          <Grid item xs={6}>
            <CustomFormLabel htmlFor="presupuesto_euros">Presupuesto en euros</CustomFormLabel>
            <TextField
              id="presupuesto_euros"
              name="presupuesto_euros"
              type="number"
              variant="outlined"
              fullWidth
              autoComplete="budget-eur"
              value={formik.values.presupuesto_euros}
              onChange={handleQuetzalesChange}
              error={formik.touched.presupuesto_euros && Boolean(formik.errors.presupuesto_euros)}
              helperText={formik.touched.presupuesto_euros && formik.errors.presupuesto_euros}
              disabled
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={formik.isSubmitting}
          sx={{ mt: 2 }}
        >
          Guardar
        </Button>
      </form>
    </ParentCard>
  )
}

export default ProyectosOrdinaryForm
