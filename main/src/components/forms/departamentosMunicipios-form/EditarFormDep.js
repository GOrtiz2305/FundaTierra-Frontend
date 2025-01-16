import React, { useEffect, useState } from 'react';
import {
  Button,
  FormHelperText,
  Typography,
  Alert,
} from '@mui/material';
import CustomTextField from '../theme-elements/CustomTextField';
import ParentCard from '../../shared/ParentCard';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import { URL } from '../../../../config';

const EditarDepartamentoForm = ({ id }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const fetchDepartamento = async () => {
    try {
      const response = await fetch(`${URL}departamentos/${id}`);
      if (response.ok) {
        const data = await response.json();
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
        navigate('/departamentos');
        <Alert variant="filled" severity="success">
          Departamento actualizado con éxito
        </Alert>;
      } else {
        <Alert variant="filled" severity="error">
          Error al actualizar el departamento
        </Alert>;
      }
    } catch (err) {
      console.error('Error al llamar a la API:', err);
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

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <ParentCard title="Formulario de Edición de Departamento">
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

        <CustomFormLabel htmlFor="estado">Estado</CustomFormLabel>
        <CustomTextField
          id="estado"
          name="estado"
          type="checkbox"
          checked={formik.values.estado}
          onChange={(e) => formik.setFieldValue('estado', e.target.checked)}
          fullWidth
        />

        <div style={{ marginTop: '25px' }}>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Guardar Cambios
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
