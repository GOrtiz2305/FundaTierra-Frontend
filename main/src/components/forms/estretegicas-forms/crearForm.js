import {
  Alert,
  Button,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import { URL } from "../../../../config";
import ParentCard from '../../shared/ParentCard';
import CustomTextField from '../theme-elements/CustomTextField';

const LineasEstrategicasForm = () => {
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
      const response = await fetch(`${URL}lineasEstrategicas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...values, id_usuario: 3 }),
      });

      if (response.ok) {
        navigate(-1);
        <Alert variant="filled" severity="success">
          Linea estrategica creada con exito
        </Alert>;
      } else {
        <Alert variant="filled" severity="error">
          Error al la linea estrategica
        </Alert>;
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      alert('Error al llamar a la API');
    }
  };

  const validationSchema = yup.object({
    nombre: yup.string().required('El nombre de la linea estrategica es obligatoria'),
  });

  const formik = useFormik({
    initialValues: {
      id_usuarios:'3', 
      nombre: '',
      estado: true,
    },
    validationSchema,
    onSubmit: (values) => {
      handleSave(values);
    },
  });

  return (
    <ParentCard title="Formulario de Creación de Lineas Estrategicas">
      <form onSubmit={formik.handleSubmit}>
        <CustomFormLabel htmlFor="nombre">Nombre de la linea estrategica</CustomFormLabel>
        <CustomTextField
          id='3'
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
export default LineasEstrategicasForm;