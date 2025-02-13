import {
  Alert,
  Button,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { URL } from '../../../../config';
import ParentCard from '../../shared/ParentCard';
import CustomTextField from '../theme-elements/CustomTextField';
  
  const RubrosEditarForm = () => {
     const { id } = useParams(); // Obtener el id de la URL
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
      if (!id) {
        setError('ID no proporcionado');
        setLoading(false);
        return;
      }
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
      nombre_rubro: yup.string().required('El nombre del rubro es necesario'),
    });
  
    const formik = useFormik({
      initialValues: initialData || {
        nombre_rubro: '',
      },
      validationSchema,
      onSubmit: (values) => {
        handleSave(values);
      },
      enableReinitialize: true,
    });
  
    if (loading) return <Alert severity="info">Cargando datos...</Alert>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!id) return <Alert severity="error">ID no proporcionado</Alert>;
  
    return (
      <ParentCard title='Editar rubro'>
        <form onSubmit={formik.handleSubmit}>
          <CustomFormLabel htmlFor="nombre_rubro">Nombre del rubro</CustomFormLabel>
          <CustomTextField
            name="nombre_rubro"
            variant="outlined"
            onChange={formik.handleChange}
            value={formik.values.nombre_rubro}
            error={formik.touched.nombre_rubro && Boolean(formik.errors.nombre_rubro)}
            helperText={formik.touched.nombre_rubro && formik.errors.nombre_rubro}
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
  