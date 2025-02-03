import {
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import { URL } from "../../../../config";
import ParentCard from '../../shared/ParentCard';
import CustomFormLabel from '../theme-elements/CustomFormLabel';
import CustomTextField from '../theme-elements/CustomTextField';

const ProyectosOrdinaryForm = () => {
  const navigate = useNavigate();
  const [conversionRate, setConversionRate] = useState(0.11); // Tasa de conversión por defecto
  const [cooperantesOptions, setCooperantesOptions] = useState([]);
  const [lineasEstrategicasOptions, setLineasEstrategicasOptions] = useState([]);

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/GTQ`);
        const data = await response.json();
        if (data && data.rates && data.rates.EUR) {
          setConversionRate(data.rates.EUR);
        } else {
          console.error('Error al obtener la tasa de conversión.');
          alert('No se pudo obtener la tasa de conversión');
        }
      } catch (error) {
        console.error('Error al llamar a la API de conversión:', error);
        alert('Hubo un problema al obtener la tasa de conversión');
      }
    };

    fetchConversionRate();
  }, []);

  useEffect(() => {
    const fetchCooperantes = async () => {
      try {
        const response = await fetch(`${URL}cooperante`);
        if (!response.ok) throw new Error('Error al obtener los cooperantes');
        const data = await response.json();
        setCooperantesOptions(data);
      } catch (error) {
        console.error('Error al obtener los cooperantes:', error);
        alert('Hubo un problema al obtener los cooperantes');
      }
    };

    fetchCooperantes();
  }, []);

  useEffect(() => {
    const fetchLineasEstrategicas = async () => {
      try {
        const response = await fetch(`${URL}lineasEstrategicas`);
        if (!response.ok) throw new Error('Error al obtener las líneas estratégicas');
        const data = await response.json();
        setLineasEstrategicasOptions(data);
      } catch (error) {
        console.error('Error al obtener las líneas estratégicas:', error);
        alert('Hubo un problema al obtener las líneas estratégicas');
      }
    };

    fetchLineasEstrategicas();
  }, []);

  const handleSave = async (values) => {
    try {
      // Primero, crea el proyecto solo cuando los datos sean válidos
      const dataToSend = {
        ...values,
        id_usuario: 3, // ID del usuario
        id_estado: 1,  // Estado inicial
      };

      const responseProyecto = await fetch(`${URL}proyectos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!responseProyecto.ok) {
        throw new Error('Error al crear el proyecto');
      }

      const proyectoCreado = await responseProyecto.json();
      const idProyecto = proyectoCreado.id; // Obtén el ID del proyecto creado

      // Luego, envía los cooperantes
      const cooperantesEnviar = values.cooperantes.map((idCooperantes) => ({
        id_cooperante: Number(idCooperantes),
        id_proyecto: idProyecto,  // Usa el ID del proyecto creado
      }));

      const responseCooperantes = await fetch(`${URL}proyectoCooperantes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cooperantesEnviar),
      });

      if (!responseCooperantes.ok) {
        throw new Error('Error al guardar los cooperantes');
      }

      // Finalmente, envía las líneas estratégicas
      const lineasEstrategicasEnviar = values.lineas_estrategicas.map((idLinea) => ({
        id_linea_estrategica: Number(idLinea),
        id_proyecto: idProyecto,  // Usa el ID del proyecto creado
      }));

      const responseLineas = await fetch(`${URL}proyectoLinea`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lineasEstrategicasEnviar),
      });

      if (!responseLineas.ok) {
        throw new Error('Error al guardar las líneas estratégicas');
      }

      alert('Proyecto creado con éxito');
      navigate('/proyectos');
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      alert('Hubo un problema al guardar los datos del proyecto');
    }
  };

  const validationSchema = yup.object({
    nombre: yup.string().required('El nombre del proyecto es necesario'),
    alias: yup.string().required('El alias es necesario'),
    cooperantes: yup.array().min(1, 'Seleccione al menos un cooperante').required('Los cooperantes son necesarios'),
    lineas_estrategicas: yup.array().min(1, 'Seleccione al menos una línea estratégica').required('Las líneas estratégicas son necesarias'),
    descripcion: yup.string().required('La descripción es necesaria'),
    fecha_inicio: yup.date().required('La fecha de inicio es necesaria'),
    fecha_fin: yup.date().required('La fecha final es necesaria'),
    presupuesto_quetzales: yup
      .number()
      .typeError('El presupuesto debe ser un número')
      .positive('Debe ser un número positivo')
      .required('El presupuesto en quetzales es necesario'),
  });

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
    onSubmit: (values) => {
      handleSave(values);
    },
  });

  const handleQuetzalesChange = (event) => {
    const valueInQuetzales = event.target.value;
    formik.setFieldValue('presupuesto_quetzales', valueInQuetzales);

    if (!isNaN(valueInQuetzales) && valueInQuetzales !== '') {
      const valueInEuros = (valueInQuetzales * conversionRate).toFixed(2); // Redondear a 2 decimales
      formik.setFieldValue('presupuesto_euros', valueInEuros);
    } else {
      formik.setFieldValue('presupuesto_euros', '');
    }
  };

  return (
    <ParentCard title="Formulario de proyectos - Información general">
      <form onSubmit={formik.handleSubmit}>
        {/* Nombre y Alias */}
        <CustomFormLabel htmlFor="nombre">Nombre del Proyecto</CustomFormLabel>
        <CustomTextField
          id="nombre"
          name="nombre"
          variant="outlined"
          fullWidth
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
          value={formik.values.alias}
          onChange={formik.handleChange}
          error={formik.touched.alias && Boolean(formik.errors.alias)}
          helperText={formik.touched.alias && formik.errors.alias}
        />

        {/* Cooperantes y Líneas Estratégicas */}
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
                onChange={(e) => formik.setFieldValue("cooperantes", e.target.value)}
                input={<OutlinedInput id="select-multiple-chip" label="Seleccione los cooperantes" />}
                renderValue={(selected) => (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selected.map((cooperanteId) => {
                      const cooperante = cooperantesOptions.find((r) => r.id === cooperanteId);
                      return <Chip key={cooperanteId} label={cooperante ? cooperante.nombre_donante : ''} />;
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
            <CustomFormLabel htmlFor="lineas_estrategicas">Líneas Estratégicas</CustomFormLabel>
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
                      const linea = lineasEstrategicasOptions.find((r) => r.id === value);
                      return <Chip key={value} label={linea ? linea.nombre : ''} />;
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

        {/* Fechas y presupuesto */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomFormLabel htmlFor="fecha_inicio">Fecha de Inicio</CustomFormLabel>
            <TextField
              id="fecha_inicio"
              name="fecha_inicio"
              type="date"
              variant="outlined"
              fullWidth
              value={formik.values.fecha_inicio}
              onChange={formik.handleChange}
              error={formik.touched.fecha_inicio && Boolean(formik.errors.fecha_inicio)}
              helperText={formik.touched.fecha_inicio && formik.errors.fecha_inicio}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={6}>
            <CustomFormLabel htmlFor="fecha_fin">Fecha de Fin</CustomFormLabel>
            <TextField
              id="fecha_fin"
              name="fecha_fin"
              type="date"
              variant="outlined"
              fullWidth
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
            <CustomFormLabel htmlFor="presupuesto_quetzales">Presupuesto en Quetzales</CustomFormLabel>
            <TextField
              id="presupuesto_quetzales"
              name="presupuesto_quetzales"
              type="number"
              variant="outlined"
              fullWidth
              value={formik.values.presupuesto_quetzales}
              onChange={handleQuetzalesChange}
              error={formik.touched.presupuesto_quetzales && Boolean(formik.errors.presupuesto_quetzales)}
              helperText={formik.touched.presupuesto_quetzales && formik.errors.presupuesto_quetzales}
            />
          </Grid>

          <Grid item xs={6}>
            <CustomFormLabel htmlFor="presupuesto_euros">Presupuesto en Euros</CustomFormLabel>
            <TextField
              id="presupuesto_euros"
              name="presupuesto_euros"
              type="number"
              variant="outlined"
              fullWidth
              value={formik.values.presupuesto_euros}
              disabled
            />
          </Grid>
        </Grid>

        {/* Botón Guardar */}
        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={!formik.isValid || formik.isSubmitting}
          sx={{ mt: 2 }}
        >
          Guardar
        </Button>
      </form>
    </ParentCard>
  );
};

export default ProyectosOrdinaryForm;

