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
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { URL } from '../../../../config';
import ParentCard from '../../shared/ParentCard';
import CustomTextField from '../theme-elements/CustomTextField';

const EditarUsuarioForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const fetchUsuario = async () => {
    try {
      const response = await fetch(`${URL}usuarios/${id}`);
      if (response.ok) {
        const data = await response.json();
        formik.setValues(data);
        setLoading(false);
      } else {
        throw new Error('Error al cargar los datos del usuario 1');
      }
    } catch (err) {
      console.error(err);
      setError('Error al cargar los datos del usuario 2');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuario();
  }, [id]);

  const handleSave = async (values) => {
    try {
      const response = await fetch(`${URL}usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        navigate('/usuarios');
      } else {
        console.error('Error al actualizar el usuario');
      }
    } catch (err) {
      console.error('Error al llamar a la API:', err);
    }
  };

  const validationSchema = yup.object({
    username: yup.string().required('El nombre de usuario es obligatorio'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
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
    <ParentCard title="Formulario de edición de usuario">
      <form onSubmit={formik.handleSubmit}>
        <CustomFormLabel htmlFor="username">Nombre de usuario</CustomFormLabel>
        <CustomTextField
          id="username"
          name="username"
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.username}
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
          <Button color="primary" variant="contained" type="submit">
            Guardar cambios
          </Button>
        </div>
      </form>
    </ParentCard>
  );
};

EditarUsuarioForm.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default EditarUsuarioForm;
