import {
  Button,
  Select,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const ActividadesOrdinaryForm = () => {
  const [proyectos, setProyectos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
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

    const fetchUsuarios = async () => {
      try {
        const response = await fetch(`${URL}usuarios`);
        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);
        } else {
          console.error('Error al obtener los usuarios');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    fetchUsuarios();
    fetchProyectos();
    fetchDepartamentos();
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

      //Guardar direccion
      const dataToSendDireccion = {
        detalle: values.detalle,
        id_municipio: values.id_municipio
      };

      const responseDireccion = await fetch(`${URL}direcciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSendDireccion),
      });

      if (response.ok && responseDireccion.ok) {
        navigate('/actividades');
      }
      else {
        console.error('Error al guardar la actividad');
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      alert('Error al llamar a la API');
    }
  };

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

  const validationSchema = yup.object({
    nombre: yup.string().required('El nombre de la actividad es necesario'),
    id_proyectos: yup.string().required('El proyecto es necesario'),
    id_encargado: yup.string().required('El encargado es necesario'),
    id_direccion: yup.string().required('La dirección es necesaria'),
    id_municipio: yup.string().required('El municipio es necesario'),
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      id_proyectos: '',
      id_direccion: '',
      descripcion: '',
      fecha_inicio: '',
      id_encargado: '',
      id_municipio: '',
      id_departamento: '',
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

        <CustomFormLabel htmlFor="nombre">Nombre de la Actividad</CustomFormLabel>
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
