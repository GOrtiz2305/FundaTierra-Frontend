import {
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select
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

  const handleSave = async (values) => {
    try {
      const dataToSend = {
        ...values,
        id_usuario: 3, // ID del usuario
        id_estado: 1,  // Estado inicial
      };

      const response = await fetch(`${URL}proyectos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert('Proyecto creado con éxito');
        navigate('/pages/proyectos');
      } else {
        alert('Error al crear el proyecto');
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      alert('Error al llamar a la API');
    }
  };

  // Validaciones con Yup
  const validationSchema = yup.object({
    nombre: yup.string().required('El nombre del proyecto es necesario'),
    alias: yup.string().required('El alias es necesario'),
    cooperantes: yup.array().min(1, 'Seleccione al menos un cooperante').required('Los cooperantes son necesarios'),
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
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: '',
      presupuesto_quetzales: '',
      presupuesto_euros: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleSave(values);
      console.log(values);
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

  const cooperantesOptions = ["Cooperante A", "Cooperante B", "Cooperante C"]; // Opciones de ejemplo

  return (
    <ParentCard title="Formulario de proyectos - Información general">
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
              <MenuItem key={cooperante} value={cooperante}>
                {cooperante}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <CustomFormLabel htmlFor="descripcion">Descripción</CustomFormLabel>
        <CustomTextField
          id="descripcion"
          name="descripcion"
          multiline
          rows={4}
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.descripcion}
          fullWidth
        />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomFormLabel htmlFor="fecha_inicio">Fecha de Inicio</CustomFormLabel>
            <CustomTextField
              type="date"
              id="fecha_inicio"
              name="fecha_inicio"
              onChange={formik.handleChange}
              value={formik.values.fecha_inicio}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <CustomFormLabel htmlFor="fecha_fin">Fecha Final</CustomFormLabel>
            <CustomTextField
              type="date"
              id="fecha_fin"
              name="fecha_fin"
              onChange={formik.handleChange}
              value={formik.values.fecha_fin}
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <CustomFormLabel htmlFor="presupuesto_quetzales">Presupuesto (Quetzales)</CustomFormLabel>
            <CustomTextField
              id="presupuesto_quetzales"
              name="presupuesto_quetzales"
              variant="outlined"
              fullWidth
              value={formik.values.presupuesto_quetzales}
              onChange={handleQuetzalesChange}
              error={formik.touched.presupuesto_quetzales && Boolean(formik.errors.presupuesto_quetzales)}
              helperText={formik.touched.presupuesto_quetzales && formik.errors.presupuesto_quetzales}
            />
          </Grid>
          <Grid item xs={6}>
            <CustomFormLabel htmlFor="presupuesto_euros">Presupuesto (Euros)</CustomFormLabel>
            <CustomTextField
              id="presupuesto_euros"
              name="presupuesto_euros"
              variant="outlined"
              fullWidth
              value={formik.values.presupuesto_euros}
              disabled // Deshabilitar edición manual
            />
          </Grid>
        </Grid>

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
