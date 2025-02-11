import { Button, Chip, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { URL } from "../../../../config";
import ParentCard from '../../shared/ParentCard';
import CustomFormLabel from '../theme-elements/CustomFormLabel';
import CustomTextField from '../theme-elements/CustomTextField';

const ProyectosEditarForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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

  useEffect(() => {
    const fetchProyecto = async () => {
      try {
        const response = await axios.get(`${URL}proyectos/${id}`);
        const proyectoData = response.data;
        setProyecto({
          ...proyectoData,
          cooperantes: Array.isArray(proyectoData.cooperantes) ? proyectoData.cooperantes : [],
          lineas_estrategicas: Array.isArray(proyectoData.lineas_estrategicas) ? proyectoData.lineas_estrategicas : [],
        });
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener el proyecto:', error);
        setLoading(false);
      }
    };
    fetchProyecto();
  }, [id, conversionRate]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const cooperantesResponse = await axios.get(`${URL}cooperante`);
        const lineasEstrategicasResponse = await axios.get(`${URL}lineasEstrategicas`);

        setCooperantesOptions(cooperantesResponse.data);
        setLineasEstrategicasOptions(lineasEstrategicasResponse.data);
      } catch (error) {
        console.error('Error al obtener las opciones de cooperantes y líneas estratégicas:', error);
      }
    };
    fetchOptions();
  }, []);

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
      console.log("Enviando datos del proyecto:", values);

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
          navigate('/proyectos');
        } else {
          alert('Error al actualizar el proyecto');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
        alert('Error al llamar a la API');
      }
    },
  });

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
                      const linea = lineasEstrategicasOptions.find(linea => linea.id === value);
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

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomFormLabel htmlFor="presupuesto_quetzales">Presupuesto en Quetzales</CustomFormLabel>
            <CustomTextField
              id="presupuesto_quetzales"
              name="presupuesto_quetzales"
              type="number"
              fullWidth
              value={formik.values.presupuesto_quetzales}
              onChange={handleQuetzalesChange}
              error={formik.touched.presupuesto_quetzales && Boolean(formik.errors.presupuesto_quetzales)}
              helperText={formik.touched.presupuesto_quetzales && formik.errors.presupuesto_quetzales}
            />
          </Grid>

          <Grid item xs={6}>
            <CustomFormLabel htmlFor="presupuesto_euros">Presupuesto en Euros</CustomFormLabel>
            <CustomTextField
              id="presupuesto_euros"
              name="presupuesto_euros"
              type="number"
              fullWidth
              value={formik.values.presupuesto_euros}
              onChange={formik.handleChange}
              error={formik.touched.presupuesto_euros && Boolean(formik.errors.presupuesto_euros)}
              helperText={formik.touched.presupuesto_euros && formik.errors.presupuesto_euros}
            />
          </Grid>
        </Grid>

        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          onClick={() => console.log(formik.values)}
        >
          Actualizar Proyecto
        </Button>
      </form>
    </ParentCard>
  );
};

export default ProyectosEditarForm;
