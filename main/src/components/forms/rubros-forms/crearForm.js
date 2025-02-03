import {
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
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

const RubrosForm = () => {
  const navigate = useNavigate();
  const [rubros, setRubros] = useState([]);
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

  // Función para obtener la lista de rubros
  const fetchRubros = async () => {
    try {
      const response = await fetch(`${URL}rubros`);
      if (response.ok) {
        const data = await response.json();
        setRubros(data);
      } else {
        console.error('Error al obtener los rubros');
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
    }
  };

  // Obtener la lista de rubros al cargar el componente
  useEffect(() => {
    fetchRubros();
  }, []);

  // Función para guardar un nuevo rubro
  const handleSave = async (values, { resetForm }) => {
    try {
      const response = await fetch(`${URL}rubros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        fetchRubros(); // Actualizar el listado de rubros
        resetForm(); // Limpiar el formulario
        setAlert({ type: 'success', message: 'Rubro creado con éxito' }); // Mostrar alerta de éxito
      } else {
        setAlert({ type: 'error', message: 'Error al crear el rubro' }); // Mostrar alerta de error
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      setAlert({ type: 'error', message: 'Error al llamar a la API' }); // Mostrar alerta de error
    }
  };

  // Validación del formulario
  const validationSchema = yup.object({
    nombre_rubro: yup.string().required('El nombre del rubro es necesario'),
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      nombre_rubro: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleSave(values, { resetForm });
      console.log(values);
    },
  });

  // Función para manejar la edición de un rubro
  const handleEdit = (id) => {
    navigate(`/Rubros/cambios/${id}`);
  };

  return (
    <ParentCard title='Formulario de Rubros'>
      {/* Mostrar alertas */}
      {alert && (
        <Alert variant="filled" severity={alert.type} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Formulario para crear un rubro */}
      <form onSubmit={formik.handleSubmit}>
        <CustomFormLabel htmlFor="nombre_rubro">Nombre del rubro</CustomFormLabel>
        <CustomTextField
          name="nombre_rubro"
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.nombre_rubro}
          error={formik.touched.nombre_rubro && Boolean(formik.errors.nombre_rubro)}
          helperText={formik.touched.nombre_rubro && formik.errors.nombre_rubro}
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

      {/* Listado de rubros */}
      <br /><br />
      <Typography variant="h6">Listado de Rubros</Typography>
      <List>
        {rubros.map((rubro) => (
          <ListItem key={rubro.id}>
            <ListItemText primary={rubro.nombre_rubro} />
           <Button
                         variant="contained"
                         color="secondary"
                         onClick={() => handleEdit(rubro.id)}
                       >
                         Editar
                       </Button>
          </ListItem>
        ))}
      </List>
    </ParentCard>
  );
};

export default RubrosForm;