import {
    Alert,
    Button,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import { URL } from '../../../../config';
import ParentCard from '../../shared/ParentCard';
import CustomTextField from '../theme-elements/CustomTextField';
  
  const RubrosEditarForm = ({ id }) => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
  
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
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${URL}rubros/${id}`);
          if (!response.ok) {
            throw new Error('Error al obtener los datos');
          }
          const data = await response.json();
          setInitialData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [id]);
  
    const handleSave = async (values) => {
      try {
        const response = await fetch(`${URL}rubros/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
  
        if (response.ok) {
          navigate('/rubros');
          alert('Rubro actualizado con éxito');
        } else {
          alert('Error al actualizar el rubro');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
        alert('Error al llamar a la API');
      }
    };
  
    const validationSchema = yup.object({
      nombre: yup.string().required('El nombre del rubro es necesario'),
    });
  
    const formik = useFormik({
      initialValues: initialData || {
        nombre: '',
      },
      validationSchema,
      onSubmit: (values) => {
        handleSave(values);
      },
      enableReinitialize: true,
    });
  
    if (loading) return <Alert severity="info">Cargando datos...</Alert>;
    if (error) return <Alert severity="error">{error}</Alert>;
  
    return (
      <ParentCard title='Editar Rubro'>
        <form onSubmit={formik.handleSubmit}>
          <CustomFormLabel htmlFor="nombre">Nombre del Rubro</CustomFormLabel>
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
              Actualizar
            </Button>
          </div>
        </form>
      </ParentCard>
    );
  };
  
  export default RubrosEditarForm;
  