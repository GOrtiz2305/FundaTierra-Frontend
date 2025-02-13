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

const RubrosForm = () => {
  const navigate = useNavigate();
  const [rubros, setCooperantes] = useState([]);

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
  const fetchRubros = async () => {
    try {
      const response = await fetch(`${URL}rubros`);
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
      const response = await fetch(`${URL}rubros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        alert('Rubro creado con éxito');
        navigate('/rubros');
        
      } else {
        alert('Error al crear el rubro');
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      alert('Error al llamar a la API');
    }
  };

  // Validación del formulario
  const validationSchema = yup.object({
    nombre_rubro: yup.string().required('El nombre del cooperante es necesario'),
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

  // Función para manejar la edición de un cooperante
  const handleEdit = (id) => {
    navigate(`/rubros/cambios/${id}`);
  };

  return (
    <ParentCard title='Formulario de rubro'>
      {/* Formulario para crear un cooperante */}
      <form onSubmit={formik.handleSubmit}>
        <CustomFormLabel htmlFor="nombre">Nombre del rubro</CustomFormLabel>
        <CustomTextField
          id="nombre_donante"
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

     
    </ParentCard>
  );
};
export default RubrosForm;