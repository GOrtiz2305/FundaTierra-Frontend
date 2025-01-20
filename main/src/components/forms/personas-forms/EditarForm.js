import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Alert,
  MenuItem,
} from '@mui/material';
import CustomTextField from '../theme-elements/CustomTextField';
import ParentCard from '../../shared/ParentCard';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { URL } from '../../../../config';

const EditarPersonaForm = () => {
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

  const fetchPersona = async () => {
    try {
      const response = await fetch(`${URL}personas/${id}`);
      if (response.ok) {
        const data = await response.json();
        formik.setValues(data);
        setLoading(false);
      } else {
        throw new Error('Error al cargar los datos de la persona');
      }
    } catch (err) {
      console.error(err);
      setError('Error al cargar los datos de la persona');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersona();
  }, [id]);

  const handleSave = async (values) => {
    try {
      const response = await fetch(`${URL}personas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        navigate('/personas');
      } else {
        console.error('Error al actualizar la persona');
      }
    } catch (err) {
      console.error('Error al llamar a la API:', err);
    }
  };

  const validationSchema = yup.object({
    nombre: yup.string().required('El nombre es obligatorio'),
    apellido: yup.string().required('El apellido es obligatorio'),
    sexo: yup.string().required('El sexo es obligatorio'),
    telefono: yup
      .string()
      .required('El teléfono es obligatorio')
      .matches(/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos'),
    correo_electronico: yup
      .string()
      .required('El correo electrónico es obligatorio')
      .email('Debe ser un correo electrónico válido'),
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      sexo: '',
      telefono: '',
      correo_electronico: '',
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
    <ParentCard title="Formulario de Edición de Persona">
      <form onSubmit={formik.handleSubmit}>
        <CustomFormLabel htmlFor="nombre">Nombre</CustomFormLabel>
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

        <CustomFormLabel htmlFor="apellido">Apellido</CustomFormLabel>
        <CustomTextField
          id="apellido"
          name="apellido"
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.apellido}
          error={formik.touched.apellido && Boolean(formik.errors.apellido)}
          helperText={formik.touched.apellido && formik.errors.apellido}
          onBlur={formik.handleBlur}
          fullWidth
        />

        <CustomFormLabel htmlFor="sexo">Sexo</CustomFormLabel>
        <CustomTextField
          id="sexo"
          name="sexo"
          select
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.sexo}
          error={formik.touched.sexo && Boolean(formik.errors.sexo)}
          helperText={formik.touched.sexo && formik.errors.sexo}
          onBlur={formik.handleBlur}
          fullWidth
        >
          <MenuItem value="Masculino">Masculino</MenuItem>
          <MenuItem value="Femenino">Femenino</MenuItem>
          <MenuItem value="Otro">Otro</MenuItem>
        </CustomTextField>

        <CustomFormLabel htmlFor="telefono">Teléfono</CustomFormLabel>
        <CustomTextField
          id="telefono"
          name="telefono"
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.telefono}
          error={formik.touched.telefono && Boolean(formik.errors.telefono)}
          helperText={formik.touched.telefono && formik.errors.telefono}
          onBlur={formik.handleBlur}
          fullWidth
        />

        <CustomFormLabel htmlFor="correo_electronico">
          Correo Electrónico
        </CustomFormLabel>
        <CustomTextField
          id="correo_electronico"
          name="correo_electronico"
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.correo_electronico}
          error={
            formik.touched.correo_electronico &&
            Boolean(formik.errors.correo_electronico)
          }
          helperText={
            formik.touched.correo_electronico && formik.errors.correo_electronico
          }
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
            Guardar Cambios
          </Button>
        </div>
      </form>
    </ParentCard>
  );
};

export default EditarPersonaForm;
