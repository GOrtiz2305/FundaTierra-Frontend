import { Button } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { URL } from "../../../../config";
import ParentCard from '../../shared/ParentCard';
import CustomFormLabel from '../theme-elements/CustomFormLabel'; // Asegúrate de importar este componente
import CustomTextField from '../theme-elements/CustomTextField';



const ProyectosOrdinaryForm = () => {
  const navigate = useNavigate();

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
    descripcion: yup.string().required('La descripción es necesaria'),
    fecha_inicio: yup.date().required('La fecha de inicio es necesaria'),
    fecha_fin: yup.date().required('La fecha final es necesaria'),
    presupuesto: yup
      .string()
      .matches(/^Q?\s?(\d+(\.\d{0,2})?)?$/, 'Formato de presupuesto inválido')
      .required('El presupuesto es necesario'),
  });

  // Inicialización de Formik
  const formik = useFormik({
    initialValues: {
      nombre: '',
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: '',
      presupuesto: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleSave(values);
      console.log(values);
    },
  });

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

        <CustomFormLabel htmlFor="fecha_inicio">Fecha de Inicio</CustomFormLabel>
        <CustomTextField
          type="date"
          id="fecha_inicio"
          name="fecha_inicio"
          onChange={formik.handleChange}
          value={formik.values.fecha_inicio}
          fullWidth
        />

        <CustomFormLabel htmlFor="fecha_fin">Fecha Final</CustomFormLabel>
        <CustomTextField
          type="date"
          id="fecha_fin"
          name="fecha_fin"
          onChange={formik.handleChange}
          value={formik.values.fecha_inicio}
          fullWidth
        />

        <CustomFormLabel htmlFor="presupuesto">Presupuesto</CustomFormLabel>
        <CustomTextField
          id="presupuesto"
          name="presupuesto"
          variant="outlined"
          fullWidth
          value={formik.values.presupuesto}
          onChange={formik.handleChange}
          error={formik.touched.presupuesto && Boolean(formik.errors.presupuesto)}
          helperText={formik.touched.presupuesto && formik.errors.presupuesto}
        />

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