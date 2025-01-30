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
  
  const RubrosForm = () => {
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
        const response = await fetch(`${URL}rubros`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
  
        if (response.ok) {
          navigate('/rubros');
          <Alert variant="filled" severity="success">
            Rubro creado con éxito
          </Alert>
        } else {
          <Alert variant='filled' severity='error'>
            Error al crear el rubro
          </Alert>
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
        alert('Error al llamar a la API');
      }
    };
  
    const validationSchema = yup.object({
      nombre: yup.string().required('El nombre del rubro  es necesario'),
    });
  
    const formik = useFormik({
      initialValues: {
        nombre: '',
      },
      validationSchema,
      onSubmit: (values) => {
        handleSave(values);
        console.log(values);
      },
    });
  
    return (
      <ParentCard title='Formulario de Rubros'>
        <form onSubmit={formik.handleSubmit}>
          <CustomFormLabel htmlFor="nombre">Nombre del rubro</CustomFormLabel>
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
  
  export default RubrosForm;