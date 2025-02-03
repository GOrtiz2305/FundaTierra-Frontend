import { Button, Chip, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Usar useParams para obtener el id del proyecto
import * as yup from 'yup';
import { URL } from "../../../../config";
import ParentCard from '../../shared/ParentCard';
import CustomFormLabel from '../theme-elements/CustomFormLabel';
import CustomTextField from '../theme-elements/CustomTextField';

const ProyectosEditarForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtenemos el id del proyecto de la URL
  const [conversionRate, setConversionRate] = useState(0.11);
  const [loading, setLoading] = useState(true);
  const [cooperantesOptions, setCooperantesOptions] = useState([]);
  const [lineasEstrategicasOptions, setLineasEstrategicasOptions] = useState([]);
  
  const [proyecto, setProyecto] = useState({
    nombre: '',
    alias: '',
    cooperantes: [],
    lineas_estrategicas: [],
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    presupuesto_quetzales: '',
    presupuesto_euros: '',
  });

  // Obtener datos del proyecto
  useEffect(() => {
    const fetchProyecto = async () => {
      try {
        const response = await axios.get(`${URL}proyectos/${id}`);
        const proyectoData = response.data;
        setProyecto({
          ...proyectoData,
          presupuesto_euros: (proyectoData.presupuesto_quetzales * conversionRate).toFixed(2),
        });
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener el proyecto:', error);
        setLoading(false);
      }
    };
    fetchProyecto();
  }, [id, conversionRate]);

  // Obtener la tasa de conversión desde la API
  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await fetch(`https://api.exchangerate.host/latest?base=GTQ&symbols=EUR`);
        const data = await response.json();
        if (data && data.rates && data.rates.EUR) {
          setConversionRate(data.rates.EUR);
        } else {
          console.error('Error al obtener la tasa de conversión.');
        }
      } catch (error) {
        console.error('Error al llamar a la API de conversión:', error);
      }
    };
    fetchConversionRate();
  }, []);

  // Obtener las opciones de cooperantes y líneas estratégicas
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const cooperantesResponse = await axios.get(`${URL}cooperantes`); // Cambia esto a la URL correcta
        const lineasEstrategicasResponse = await axios.get(`${URL}lineas-estrategicas`); // Cambia esto a la URL correcta

        setCooperantesOptions(cooperantesResponse.data);
        setLineasEstrategicasOptions(lineasEstrategicasResponse.data);
      } catch (error) {
        console.error('Error al obtener las opciones de cooperantes y líneas estratégicas:', error);
      }
    };

    fetchOptions();
  }, []);

  // Actualizar valores de Formik cuando el proyecto se actualice
  const formik = useFormik({
    initialValues: proyecto,
    enableReinitialize: true,
    validationSchema: yup.object({
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
    }),
    onSubmit: async (values) => {
      try {
        const dataToSend = {
          ...values,
          id_usuario: 3, // ID del usuario
          id_estado: 1, // Estado inicial
        };

        const response = await fetch(`${URL}proyectos/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });

        if (response.ok) {
          alert('Proyecto actualizado con éxito');
          navigate('/pages/proyectos');
        } else {
          alert('Error al actualizar el proyecto');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
        alert('Error al llamar a la API');
      }
    },
  });

  // Actualizar presupuesto en euros al cambiar el valor en quetzales
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

  if (loading) return <div>Cargando...</div>;

  return (
    <ParentCard title="Editar Proyecto - Actualizar datos">
      <form onSubmit={formik.handleSubmit}>
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
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </div>
                )}
              >
                {cooperantesOptions.map((cooperante) => (
                  <MenuItem key={cooperante.id} value={cooperante.id}>
                    {cooperante.nombre}
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
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
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

        {/* Campos de formulario restantes */}
        <CustomFormLabel htmlFor="descripcion">Descripción</CustomFormLabel>
        <CustomTextField
          id="descripcion"
          name="descripcion"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={formik.values.descripcion}
          onChange={formik.handleChange}
          error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
          helperText={formik.touched.descripcion && formik.errors.descripcion}
        />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomFormLabel htmlFor="fecha_inicio">Fecha de Inicio</CustomFormLabel>
            <CustomTextField
              id="fecha_inicio"
              name="fecha_inicio"
              type="date"
              variant="outlined"
              fullWidth
              value={formik.values.fecha_inicio}
              onChange={formik.handleChange}
              error={formik.touched.fecha_inicio && Boolean(formik.errors.fecha_inicio)}
              helperText={formik.touched.fecha_inicio && formik.errors.fecha_inicio}
            />
          </Grid>

          <Grid item xs={6}>
            <CustomFormLabel htmlFor="fecha_fin">Fecha de Fin</CustomFormLabel>
            <CustomTextField
              id="fecha_fin"
              name="fecha_fin"
              type="date"
              variant="outlined"
              fullWidth
              value={formik.values.fecha_fin}
              onChange={formik.handleChange}
              error={formik.touched.fecha_fin && Boolean(formik.errors.fecha_fin)}
              helperText={formik.touched.fecha_fin && formik.errors.fecha_fin}
            />
          </Grid>
        </Grid>

        <CustomFormLabel htmlFor="presupuesto_quetzales">Presupuesto en Quetzales</CustomFormLabel>
        <CustomTextField
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

        <CustomFormLabel htmlFor="presupuesto_euros">Presupuesto en Euros</CustomFormLabel>
        <CustomTextField
          id="presupuesto_euros"
          name="presupuesto_euros"
          type="number"
          variant="outlined"
          fullWidth
          value={formik.values.presupuesto_euros}
          onChange={formik.handleChange}
          error={formik.touched.presupuesto_euros && Boolean(formik.errors.presupuesto_euros)}
          helperText={formik.touched.presupuesto_euros && formik.errors.presupuesto_euros}
        />

        <Button color="primary" variant="contained" fullWidth type="submit">
          Actualizar Proyecto
        </Button>
      </form>
    </ParentCard>
  );
};

export default ProyectosEditarForm;

