import { Alert, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { URL } from '../../../../config';
import ParentCard from '../../shared/ParentCard';
import CustomTextField from '../theme-elements/CustomTextField';

const LineasEstrategicasEditarForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [lineaEstrategica, setLineaEstrategica] = useState({ nombre: '' });

  useEffect(() => {
    const fetchLineaEstrategica = async () => {
      try {
        console.log("Hola")
        const response = await axios.get(`${URL}lineasEstrategicas/${id}`);
        setLineaEstrategica(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener la línea estratégica:', error);
        setAlert({ type: 'error', message: 'Error al cargar la línea estratégica' });
        setLoading(false);
      }
    };
    fetchLineaEstrategica();
  }, [id]);

  const formik = useFormik({
    initialValues: { nombre: lineaEstrategica.nombre || '' },
    enableReinitialize: true,
    validationSchema: yup.object({
      nombre: yup.string().required('El nombre es necesario'),
    }),
    onSubmit: async (values) => {
      try {
        await axios.put(`${URL}lineasEstrategicas/${id}`, values);
        setAlert({ type: 'success', message: 'Línea estratégica actualizada con éxito' });
        setTimeout(() => navigate(-1), 1500); // Redirigir tras éxito
      } catch (error) {
        console.error("Error al obtener la línea estratégica:", error.message);
        if (error.response) {
          console.error("Detalles del error:", error.response.data);
        }
        setAlert({ type: "error", message: "No se pudo cargar la línea estratégica" });
      }
    },
  });

  if (loading) return <div>Cargando...</div>;

  return (
    <ParentCard title='Editar Línea Estratégica'>
      {alert && (
        <Alert variant='filled' severity={alert.type} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}
      <form onSubmit={formik.handleSubmit}>
        <Typography variant='subtitle1' fontWeight={600}>Nombre</Typography>
        <CustomTextField
          id='nombre'
          name='nombre'
          variant='outlined'
          fullWidth
          value={formik.values.nombre}
          onChange={formik.handleChange}
          error={formik.touched.nombre && Boolean(formik.errors.nombre)}
          helperText={formik.touched.nombre && formik.errors.nombre}
        />
        <Button color='primary' variant='contained' fullWidth type='submit' style={{ marginTop: '20px' }}>
          Actualizar
        </Button>
      </form>
    </ParentCard>
  );
};

export default LineasEstrategicasEditarForm;
