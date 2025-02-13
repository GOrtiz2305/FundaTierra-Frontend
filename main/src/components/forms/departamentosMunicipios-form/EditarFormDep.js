import {
  Alert,
  Button,
  Checkbox,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import { URL } from '../../../../config';
import ParentCard from '../../shared/ParentCard';
import CustomTextField from '../theme-elements/CustomTextField';

const EditarDepartamentoForm = ({ id }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const CustomFormLabel = styled(({ htmlFor, ...other }) => (
    <Typography
      variant="subtitle1"
      fontWeight={600}
      {...other}
      component="label"
      htmlFor={htmlFor}
    />
  ))(() => ({
    marginBottom: '5px',
    marginTop: '25px',
    display: 'block',
  }));

  const fetchDepartamento = async () => {
    try {
      const response = await fetch(`${URL}departamentos/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (!data.nombre || data.estado === undefined) {
          throw new Error('Datos inválidos recibidos del servidor');
        }
        formik.setValues({
          nombre: data.nombre,
          estado: data.estado,
        });
        setLoading(false);
      } else {
        throw new Error('Error al cargar los datos del departamento');
      }
    } catch (err) {
      console.error(err);
      setError('Error al cargar los datos del departamento');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartamento();
  }, [id]);

  const handleSave = async (values) => {
    try {
      const response = await fetch(`${URL}departamentos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setSuccessMessage('Departamento actualizado con éxito');
        setTimeout(() => navigate('/DepartamentosMunicipios'), 2000);
      } else {
        setSuccessMessage('Error al actualizar el departamento');
      }
    } catch (err) {
      console.error('Error al llamar a la API:', err);
      setSuccessMessage('Error al llamar a la API');
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

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <ParentCard title="Formulario de Edición de Departamento">
      {successMessage && <Alert severity="info">{successMessage}</Alert>}
      <form onSubmit={formik.handleSubmit}>
        <CustomFormLabel htmlFor="nombre">Nombre del departamento</CustomFormLabel>
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

        <CustomFormLabel htmlFor="estado">Estado</CustomFormLabel>
        <Checkbox
          id="estado"
          name="estado"
          checked={formik.values.estado}
          onChange={(e) => formik.setFieldValue('estado', e.target.checked)}
        />

        <div style={{ marginTop: '25px' }}>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Guardar cambios
          </Button>
        </div>
      </form>
    </ParentCard>
  );
};

EditarDepartamentoForm.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default EditarDepartamentoForm;
