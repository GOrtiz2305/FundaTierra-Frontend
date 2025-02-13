import {
  Alert,
  Button,
  Typography,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import { URL } from '../../../../config';
import ParentCard from '../../shared/ParentCard';
import CustomTextField from '../theme-elements/CustomTextField';

const CrearUsuarioForm = () => {
  const navigate = useNavigate();
  const [personas, setPersonas] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const response = await fetch(`${URL}personas`);
        if (response.ok) {
          const data = await response.json();
          setPersonas(data);
        } else {
          throw new Error('Error al cargar las personas');
        }
      } catch (error) {
        console.error('Error al llamar a la API de personas:', error);
        alert('Error al llamar a la API de personas');
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await fetch(`${URL}roles`);
        if (response.ok) {
          const data = await response.json();
          setRoles(data)
        } else {
          throw new Error('Error al cargar los roles');
        }
      } catch (error) {
        console.error('Error al llamar a la API de roles:', error);
        alert('Error al llamar a la API de roles');
      }
    };

    fetchPersonas();
    fetchRoles();
  }, []);

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
      const response = await fetch(`${URL}usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        navigate('/usuarios');
        <Alert variant="filled" severity="success">
          Usuario creado con éxito
        </Alert>;
      } else {
        <Alert variant="filled" severity="error">
          Error al crear el usuario
        </Alert>;
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      alert('Error al llamar a la API');
    }
  };

  const validationSchema = yup.object({
    username: yup.string().required('El nombre de usuario es obligatorio'),
    password: yup.string().required('La contraseña es obligatoria'),
    id_persona: yup.string().required('Selecciona una persona'),
    id_rol: yup.string().required('Selecciona un rol'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      id_persona: '',
      id_rol: '',
      estado: true,
    },
    validationSchema,
    onSubmit: (values) => {
      handleSave(values);
    },
  });

  return (
    <ParentCard title="Formulario de creación de usuario">
      <form onSubmit={formik.handleSubmit}>
        <CustomFormLabel htmlFor="username">Nombre de usuario</CustomFormLabel>
        <CustomTextField
          id="username"
          name="username"
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.username}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
          onBlur={formik.handleBlur}
          fullWidth
        />

        <CustomFormLabel htmlFor="password">Contraseña</CustomFormLabel>
        <CustomTextField
          id="password"
          name="password"
          variant="outlined"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          onBlur={formik.handleBlur}
          fullWidth
        />

        <CustomFormLabel htmlFor="id_persona">Seleccionar persona</CustomFormLabel>
        <Autocomplete
          id="id_persona"
          options={personas}
          getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
          onChange={(event, newValue) => {
            formik.setFieldValue('id_persona', newValue ? newValue.id : '');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              onBlur={formik.handleBlur}
              error={formik.touched.id_persona && Boolean(formik.errors.id_persona)}
              helperText={formik.touched.id_persona && formik.errors.id_persona}
              fullWidth
            />
          )}
        />

        <CustomFormLabel htmlFor="id_rol">Seleccionar rol</CustomFormLabel>
        <Autocomplete
          id="id_rol"
          options={roles}
          getOptionLabel={(option) => option.nombre}
          onChange={(event, newValue) => {
            formik.setFieldValue('id_rol', newValue ? newValue.id : '');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              onBlur={formik.handleBlur}
              error={formik.touched.id_rol && Boolean(formik.errors.id_rol)}
              helperText={formik.touched.id_rol && formik.errors.id_rol}
              fullWidth
            />
          )}
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

export default CrearUsuarioForm;
