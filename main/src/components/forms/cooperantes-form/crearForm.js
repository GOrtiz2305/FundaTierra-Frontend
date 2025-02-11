import {
  Button,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import { URL } from "../../../../config";
import ParentCard from '../../shared/ParentCard';
import CustomTextField from '../theme-elements/CustomTextField';

const CooperanteForm = () => {
  const navigate = useNavigate();
  const [cooperantes, setCooperantes] = useState([]);

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

  // Función para obtener la lista de cooperantes
  const fetchCooperantes = async () => {
    try {
      const response = await fetch(`${URL}cooperante`);
      if (response.ok) {
        const data = await response.json();
        setCooperantes(data);
      } else {
        console.error('Error al obtener los cooperantes');
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
    }
  };



  // Función para guardar un nuevo cooperante
  const handleSave = async (values) => {
    try {
      const response = await fetch(`${URL}cooperante`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        alert('Cooperante creado con éxito');
        navigate('/cooperante');
        
      } else {
        alert('Error al crear el cooperante');
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      alert('Error al llamar a la API');
    }
  };

  // Validación del formulario
  const validationSchema = yup.object({
    nombre_donante: yup.string().required('El nombre del cooperante es necesario'),
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      nombre_donante: '',
      alias: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleSave(values, { resetForm });
      console.log(values);
    },
  });

  // Función para manejar la edición de un cooperante
  const handleEdit = (id) => {
    navigate(`/cooperante/cambios/${id}`);
  };

  return (
    <ParentCard title='Formulario de Cooperantes'>
      {/* Formulario para crear un cooperante */}
      <form onSubmit={formik.handleSubmit}>
        <CustomFormLabel htmlFor="nombre">Nombre del cooperante</CustomFormLabel>
        <CustomTextField
          id="nombre_donante"
          name="nombre_donante"
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.nombre_donante}
          error={formik.touched.cooperante && Boolean(formik.errors.nombre_donante)}
          helperText={formik.touched.nombre_donante && formik.errors.nombre_donante}
          onBlur={formik.handleBlur}
          fullWidth
        />
        <CustomFormLabel htmlFor="alias">Alias del cooperante</CustomFormLabel>
        <CustomTextField
          id="alias"
          name="alias"
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.alias}
          error={formik.touched.alias && Boolean(formik.errors.alias)}
          helperText={formik.touched.alias && formik.errors.alias}
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

     
    </ParentCard>
  );
};

export default CooperanteForm;