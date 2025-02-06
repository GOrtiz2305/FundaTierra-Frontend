import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Alert,
  MenuItem,
  Grid,
  Autocomplete,
  TextField,
  Select,
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
  const [municipios, setMunicipios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [id_direccion, setIdDireccion] = useState(null);

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

  const CustomSelect = styled((props) => <Select {...props} />)(({ }) => ({}));

  useEffect(() => {
    const fetchPersona = async () => {
      try {
        const response = await fetch(`${URL}personas/${id}`);
        if (response.ok) {
          const data = await response.json();
          formik.setValues(data);
          setLoading(false);
          setIdDireccion(data.id_direccion);

          const responseDireccion = await fetch(`${URL}direcciones/${data.id_direccion}`);
          if (responseDireccion.ok) {
            const dataDireccion = await responseDireccion.json();
            formikDireccion.setValues(dataDireccion);
          }
        } else {
          throw new Error('Error al cargar los datos de la persona');
        }
      } catch (err) {
        console.error(err);
        setError('Error al cargar los datos de la persona');
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
          console.error('Error al obtener los departamentos');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    fetchPersona();
    fetchDepartamentos();
  }, [id]);

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

      console.log("Datos enviados x", formikDireccion.values);
    } catch (err) {
      console.error('Error al llamar a la API:', err);
    }
  };

  const validationSchemaDireccion = yup.object({
    detalle: yup.string().required('El detalle de la dirección es obligatorio'),
    id_municipio: yup.object()
      .nullable()
      .required('Debe seleccionar un municipio'),
  });

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

  const formikDireccion = useFormik({
    initialValues: {
      detalle: '',
      id_municipio: '',
      estado: true,
    },
    validationSchema: validationSchemaDireccion,
    onSubmit: async (values) => {
      try {
        console.log("Datos enviados", values);
        const newDireccion = {
          detalle: values.detalle,
          id_municipio: values.id_municipio.id,
          estado: true,
        };

        const response = await fetch(`${URL}direcciones/${id_direccion}`, {
          method: 'PUT',
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
              value={formikDireccion.values.id_municipio || null}
              onChange={(event, newValue) => {
                //const id_municipio = newValue?.id || null;
                formikDireccion.setFieldValue('id_municipio', newValue); // Guarda el objeto completo
                //console.log("Valor seleccionado", newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                // error={formikDireccion.touched.id_municipio && Boolean(formikDireccion.errors.id_municipio)}
                // helperText={formikDireccion.touched.id_municipio && formikDireccion.errors.id_municipio}
                // onBlur={formikDireccion.handleBlur}
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
            Guardar Cambios
          </Button>
        </div>
      </form>
    </ParentCard>
  );
};

export default EditarPersonaForm;
