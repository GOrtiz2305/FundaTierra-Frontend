import {
  Autocomplete,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import { URL } from '../../../../config';
import ParentCard from '../../shared/ParentCard';
import CustomTextField from '../theme-elements/CustomTextField';

const AgregarPersonaForm = () => {
  const [municipios, setMunicipios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const navigate = useNavigate();

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

  const CustomSelect = styled((props) => <Select {...props} />)(({ }) => ({}));

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const response = await fetch(`${URL}departamentos`);
        if (response.ok) {
          const data = await response.json();
          setDepartamentos(data);
        } else {
          console.error('Error al obtener los departamentos');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    const fetchDirecciones = async () => {
      try {
        const response = await axios.get(`${URL}direcciones`);
        const sortedDirecciones = response.data.sort((a, b) => b.id - a.id)
        const lastDireccionId = sortedDirecciones[0]?.id || 0;
        const nextDireccionId = lastDireccionId + 1;
        formik.setFieldValue('id_direccion', nextDireccionId);
      } catch (error) {
        console.error('Error al obtener las direcciones:', error);
      }
    };

    fetchDepartamentos();
    fetchDirecciones();
  }, []);

  const obtenerMunicipios = async (id_departamento) => {
    try {
      const response = await fetch(`${URL}municipios/departamento/${id_departamento}`);
      if (response.ok) {
        const data = await response.json();
        setMunicipios(data);
      } else {
        console.error('Error al obtener los municipios');
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
    }
  };

  const validationSchemaDireccion = yup.object({
    detalle: yup.string().required('El detalle de la dirección es obligatorio'),
    id_municipio: yup.object()
      .nullable()
      .required('Debe seleccionar un municipio'),
  });

  const formikDireccion = useFormik({
    initialValues: {
      detalle: '',
      id_municipio: '',
      estado: true,
    },
    validationSchema: validationSchemaDireccion,
    onSubmit: async (values) => {
      try {
        const newDireccion = {
          detalle: values.detalle,
          id_municipio: values.id_municipio.id,
          estado: true,
        };

        const response = await fetch(`${URL}direcciones`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDireccion),
        });

        if (response.ok) {
          const direccionData = await response.json();
          formik.setFieldValue('id_direccion', direccionData.id);
          alert('Dirección creada con éxito');
          handleSave(formik.values);
        } else {
          alert('Error al crear la dirección');
        }
      } catch (error) {
        console.error('Error al guardar la dirección:', error);
        alert('Error al guardar la dirección');
      }
    },
  });

  const handleSave = async (values) => {
    try {
      const response = await fetch(`${URL}personas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        navigate('/personas');
      } else {
        console.error('Error al crear la persona');
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      alert('Error al llamar a la API');
    }
  };

  const validationSchemaPersona = yup.object({
    nombre: yup.string().required('El nombre es obligatorio'),
    apellido: yup.string().required('El apellido es obligatorio'),
    sexo: yup.string().required('El sexo es obligatorio'),
    telefono: yup
      .string()
      .required('El teléfono es obligatorio')
      .matches(/^[0-9]{8}$/, 'El teléfono debe tener 8 dígitos'),
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
      id_direccion: null,
      estado: true,
      id_municipio: '',
      id_departamento: '',
    },
    validationSchema: validationSchemaPersona,
    onSubmit: (values) => {
      const payload = {
        ...values,
      };
      formikDireccion.submitForm();
    },
  });

  return (
    <ParentCard title="Formulario para agregar persona">
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
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
          </Grid>
          <Grid item xs={12} sm={5}>
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
          </Grid>
          <Grid item xs={12} sm={2}>
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
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="correo_electronico">
              Correo electrónico
            </CustomFormLabel>
            <CustomTextField
              id="correo_electronico"
              name="correo_electronico"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.correo_electronico}
              error={formik.touched.correo_electronico && Boolean(formik.errors.correo_electronico)}
              helperText={formik.touched.correo_electronico && formik.errors.correo_electronico}
              onBlur={formik.handleBlur}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <CustomFormLabel htmlFor="id_departamento">Departamento</CustomFormLabel>
            <CustomSelect
              id="id_departamento"
              name="id_departamento"
              value={formik.values.id_departamento}
              onChange={(e) => {
                formik.handleChange(e);
                obtenerMunicipios(e.target.value);
              }}
              fullWidth
              variant="outlined"
            >
              {departamentos.map((departamento) => (
                <MenuItem key={departamento.id} value={departamento.id}>
                  {departamento.nombre}
                </MenuItem>
              ))}
            </CustomSelect>
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomFormLabel htmlFor="id_municipio">Municipio</CustomFormLabel>
            <Autocomplete
              id="id_municipio"
              options={municipios}
              getOptionLabel={(option) => option?.nombre || ''}
              value={formikDireccion.values.id_municipio}
              onChange={(event, newValue) =>
                formikDireccion.setFieldValue('id_municipio', newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  error={formikDireccion.touched.id_municipio && Boolean(formikDireccion.errors.id_municipio)}
                  helperText={formikDireccion.touched.id_municipio && formikDireccion.errors.id_municipio}
                  onBlur={formikDireccion.handleBlur}
                />
              )}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="detalle">
              Dirección
            </CustomFormLabel>
            <CustomTextField
              id="detalle"
              name="detalle"
              variant="outlined"
              onChange={formikDireccion.handleChange}
              value={formikDireccion.values.detalle}
              error={formikDireccion.touched.detalle && Boolean(formikDireccion.errors.detalle)}
              helperText={formikDireccion.touched.detalle && formikDireccion.errors.detalle}
              onBlur={formikDireccion.handleBlur}
              fullWidth
            />
          </Grid>
        </Grid>
        <div style={{ marginTop: '25px' }}>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </ParentCard>
  );
};

export default AgregarPersonaForm;
