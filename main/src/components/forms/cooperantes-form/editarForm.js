import {
  Alert,
  Button,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { URL } from '../../../../config';
import ParentCard from '../../shared/ParentCard';
import CustomTextField from '../theme-elements/CustomTextField';

const CooperanteEditarForm = () => {
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
        const response = await fetch(`${URL}cooperante/${id}`);
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
      const response = await fetch(`${URL}cooperante/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        navigate('/cooperante');
        alert('Cooperante actualizado con éxito');
      } else {
        alert('Error al actualizar el cooperante');
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      alert('Error al llamar a la API');
    }
  };

  const validationSchema = yup.object({
    nombre_donante: yup.string().required('El nombre del cooperante es necesario'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      nombre_donante: '',
      alias: '',
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
    <ParentCard title='Editar cooperante'>
      <form onSubmit={formik.handleSubmit}>
        <CustomFormLabel htmlFor="nombre_donante">Nombre del Cooperante</CustomFormLabel>
        <CustomTextField
          name="nombre_donante"
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.nombre_donante}
          error={formik.touched.nombre_donante && Boolean(formik.errors.nombre_donante)}
          helperText={formik.touched.nombre_donante && formik.errors.nombre_donante}
          onBlur={formik.handleBlur}
          fullWidth
        />
 <CustomFormLabel htmlFor="alias">Alias del cooperante</CustomFormLabel>
        <CustomTextField
          name="alias"
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.alias}
          error={formik.touched.alias && Boolean(formik.errors.alias)}
          helperText={formik.touched.alias && formik.errors.alias}
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

export default CooperanteEditarForm;