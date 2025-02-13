import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
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

const EditarMunicipioForm = ({ id }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [departamentos, setDepartamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const fetchMunicipio = async () => {
    try {
      const response = await fetch(`${URL}municipios/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (!data.nombre || !data.id_departamento) {
          throw new Error('Datos inválidos recibidos del servidor');
        }
        formik.setValues({
          nombre: data.nombre,
          id_departamento: data.departamentoId,
          estado: data.estado,
        });
        setLoading(false);
      } else {
        throw new Error('Error al cargar los datos del municipio');
      }
    } catch (err) {
      console.error(err);
      setError('Error al cargar los datos del municipio');
      setLoading(false);
    }
  };

  const fetchDepartamentos = async () => {
    try {
      const response = await fetch(`${URL}departamentos`);
      if (response.ok) {
        const data = await response.json();
        setDepartamentos(data);
      } else {
        throw new Error('Error al cargar los departamentos');
      }
    } catch (err) {
      console.error(err);
      setError('Error al cargar los departamentos');
    }
  };

  useEffect(() => {
    fetchMunicipio();
    fetchDepartamentos();
  }, [id]);

  const handleSave = async (values) => {
    try {
      const response = await fetch(`${URL}municipios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setSuccessMessage('Municipio actualizado con éxito');
        setTimeout(() => navigate('/DepartamentosMunicipios'), 2000);
      } else {
        setSuccessMessage('Error al actualizar el municipio');
      }
    } catch (err) {
      console.error('Error al llamar a la API:', err);
      setSuccessMessage('Error al llamar a la API');
    }
  };

  const validationSchema = yup.object({
    nombre: yup.string().required('El nombre del municipio es obligatorio'),
    departamentoId: yup
      .string()
      .required('El departamento es obligatorio'),
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      departamentoId: '',
      estado: true,
    },
    validationSchema,
    onSubmit: (values) => {
      handleSave(values);
    },
  });

  const filteredDepartamentos = departamentos.filter((dep) =>
    dep.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <ParentCard title="Formulario de Edición de Municipio">
      {successMessage && <Alert severity="info">{successMessage}</Alert>}
      <form onSubmit={formik.handleSubmit}>
        <CustomFormLabel htmlFor="nombre">Nombre del municipio</CustomFormLabel>
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

        <CustomFormLabel htmlFor="departamento">Departamento</CustomFormLabel>
        <TextField
          variant="outlined"
          placeholder="Buscar departamento"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{ marginBottom: '10px' }}
        />
        <FormControl fullWidth>
          <InputLabel id="departamento-label">Departamento</InputLabel>
          <Select
            id="departamentoId"
            name="departamentoId"
            labelId="departamento-label"
            value={formik.values.departamentoId}
            onChange={formik.handleChange}
            error={formik.touched.departamentoId && Boolean(formik.errors.departamentoId)}
          >
            {filteredDepartamentos.map((dep) => (
              <MenuItem key={dep.id} value={dep.id}>
                {dep.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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

EditarMunicipioForm.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default EditarMunicipioForm;
