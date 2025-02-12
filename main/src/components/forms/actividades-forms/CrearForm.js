import {
  Alert,
  Button,
  FormHelperText,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import { URL } from "../../../../config";
import ParentCard from '../../shared/ParentCard';
import CustomTextField from '../theme-elements/CustomTextField';

const ActividadesOrdinaryForm = () => {
  const [proyectos, setProyectos] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
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
    const fetchProyectos = async () => {
      try {
        const response = await fetch(`${URL}proyectos`);
        if (response.ok) {
          const data = await response.json();
          setProyectos(data);
        } else {
          console.error('Error al obtener los proyectos');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    const fetchDirecciones = async () => {
      try {
        const response = await fetch(`${URL}direcciones`);
        if (response.ok) {
          const data = await response.json();
          setDirecciones(data);
        } else {
          console.error('Error al obtener las direcciones');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    fetchProyectos();
    fetchDirecciones();
  }, []);

  const handleSave = async (values) => {
    try {
      // Añadir id_usuario e id_estado a values antes de enviarlo
      const dataToSend = {
        ...values,
        id_usuario: 3, // Define aquí el valor de id_usuario
        id_estado: 1   // Define aquí el valor de id_estado
      };

      const response = await fetch(`${URL}actividades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        navigate('/actividades');
        <Alert variant="filled" severity="success">
          Actividad creada con éxito
        </Alert>
      } else {
        <Alert variant='filled' severity='error'>
          Error al crear la actividad
        </Alert>
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      alert('Error al llamar a la API');
    }
  };

  const validationSchema = yup.object({
    nombre: yup.string().required('El nombre de la actividad es necesario'),
    id_proyectos: yup.string().required('El proyecto es necesario'),
    id_direccion: yup.string().required('La dirección es necesaria'),
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      id_proyectos: '',
      id_direccion: '',
      descripcion: '',
      fecha_inicio: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleSave(values); // Llamar a handleSave con los valores del formulario si es válido
      console.log(values);
    },
  });

  return (
    <ParentCard title='Formulario de Actividades - Información general'>
      <form onSubmit={formik.handleSubmit}>
        <CustomFormLabel htmlFor="fecha_inicio">Fecha</CustomFormLabel>
        <CustomTextField
          type="date"
          id="fecha_inicio"
          name="fecha_inicio"
          onChange={formik.handleChange}
          value={formik.values.fecha_inicio}
          fullWidth
        />

        <CustomFormLabel htmlFor="nombre">Nombre de la actividad</CustomFormLabel>
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

        <CustomFormLabel htmlFor="descripcion">Descripción</CustomFormLabel>
        <CustomTextField
          id="descripcion"
          name="descripcion"
          multiline
          rows={4}
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.descripcion}
          fullWidth
        />

        <CustomFormLabel htmlFor="id_proyectos">Proyecto</CustomFormLabel>
        <CustomSelect
          id="id_proyectos"
          name="id_proyectos"
          value={formik.values.id_proyectos}
          onChange={formik.handleChange}
          fullWidth
          variant="outlined"
        >
          {proyectos.map((proyecto) => (
            <MenuItem key={proyecto.id} value={proyecto.id}>
              {proyecto.nombre}
            </MenuItem>
          ))}
        </CustomSelect>
        {formik.errors.id_proyectos && (
          <FormHelperText error>
            {formik.errors.id_proyectos}
          </FormHelperText>
        )}

        <CustomFormLabel htmlFor="id_direccion">Dirección</CustomFormLabel>
        <CustomSelect
          id="id_direccion"
          name="id_direccion"
          value={formik.values.id_direccion}
          onChange={formik.handleChange}
          fullWidth
          variant="outlined"
        >
          {direcciones.map((direccion) => (
            <MenuItem key={direccion.id} value={direccion.id}>
              {direccion.detalle}
            </MenuItem>
          ))}
        </CustomSelect>
        {formik.errors.id_direccion && (
          <FormHelperText error>
            {formik.errors.id_direccion}
          </FormHelperText>
        )}

        <br /><br />
        <div>
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

export default ActividadesOrdinaryForm;
