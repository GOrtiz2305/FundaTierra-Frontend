import {
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import { URL } from "../../../../config";
import ParentCard from '../../shared/ParentCard';
import CustomTextField from '../theme-elements/CustomTextField';

const LineasEstrategicasForm = () => {
  const navigate = useNavigate();
  const [lineasEstrategicas, setLineasEstrategicas] = useState([]);
  const [alert, setAlert] = useState(null); // Estado para manejar alertas

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

  // Función para obtener la lista de líneas estratégicas
  const fetchLineasEstrategicas = async () => {
    try {
      const response = await fetch(`${URL}lineasEstrategicas`);
      if (response.ok) {
        const data = await response.json();
        setLineasEstrategicas(data);
      } else {
        console.error('Error al obtener las líneas estratégicas');
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
    }
  };

  // Obtener la lista de líneas estratégicas al cargar el componente
  useEffect(() => {
    fetchLineasEstrategicas();
  }, []);

  // Función para guardar una nueva línea estratégica
  const handleSave = async (values, { resetForm }) => {
    try {
      const dataToSend = {
        ...values,
        id_usuario: 3, // ID del usuario
      };
      const response = await fetch(`${URL}lineasEstrategicas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        fetchLineasEstrategicas(); // Actualizar el listado de líneas estratégicas
        resetForm(); // Limpiar el formulario
        setAlert({ type: 'success', message: 'Línea estratégica creada con éxito' }); // Mostrar alerta de éxito
      } else {
        setAlert({ type: 'error', message: 'Error al crear la línea estratégica' }); // Mostrar alerta de error
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      setAlert({ type: 'error', message: 'Error al llamar a la API' }); // Mostrar alerta de error
    }
  };

  // Validación del formulario
  const validationSchema = yup.object({
    nombre: yup.string().required('El nombre de la línea estratégica es necesario'),
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      nombre: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleSave(values, { resetForm });
      console.log(values);
    },
  });

  // Función para manejar la edición de una línea estratégica
  const handleEdit = (id) => {
    navigate(`/lineasEstregicas/cambios/${id}`); // Redirige a la página de edición con el id
  };

  return (
    <ParentCard title='Formulario de Líneas Estratégicas'>
      {/* Mostrar alertas */}
      {alert && (
        <Alert variant="filled" severity={alert.type} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Formulario para crear una línea estratégica */}
      <form onSubmit={formik.handleSubmit}>
        <CustomFormLabel htmlFor="nombre">Nombre de la línea estratégica</CustomFormLabel>
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

      {/* Listado de líneas estratégicas */}
      <br /><br />
      <Typography variant="h6">Listado de Líneas Estratégicas</Typography>
      <List>
        {lineasEstrategicas.map((linea) => (
          <ListItem key={linea.id}>
            <ListItemText primary={linea.nombre} />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleEdit(linea.id)} // Llama a handleEdit con el id de la línea
            >
              Editar
            </Button>
          </ListItem>
        ))}
      </List>
    </ParentCard>
  );
};

export default LineasEstrategicasForm;