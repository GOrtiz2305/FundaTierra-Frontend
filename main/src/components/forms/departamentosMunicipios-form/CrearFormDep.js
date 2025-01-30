import React from 'react';
import {
  Button,
  Typography,
  Alert,
} from '@mui/material';
import CustomTextField from '../theme-elements/CustomTextField';
import ParentCard from '../../shared/ParentCard';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router';
import { URL } from '../../../../config';

const CrearDepartamentoForm = () => {
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

  const handleSave = async (values) => {
    try {
      const response = await fetch(`${URL}departamentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        navigate('/DepartamentosMunicipios');
        <Alert variant="filled" severity="success">
          Departamento creado con éxito
        </Alert>;
      } else {
        <Alert variant="filled" severity="error">
          Error al crear el departamento
        </Alert>;
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      alert('Error al llamar a la API');
    }
  };

  const validationSchema = yup.object({
    nombre: yup.string().required('El nombre del departamento es obligatorio'),
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      estado: true,
    },
    validationSchema,
    onSubmit: (values) => {
      handleSave(values);
    },
  });

  return (
    <ParentCard title="Formulario de Creación de Departamento">
      <form onSubmit={formik.handleSubmit}>
        <CustomFormLabel htmlFor="nombre">Nombre del Departamento</CustomFormLabel>
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

        <div style={{ marginTop: '25px' }}>
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

export default CrearDepartamentoForm;