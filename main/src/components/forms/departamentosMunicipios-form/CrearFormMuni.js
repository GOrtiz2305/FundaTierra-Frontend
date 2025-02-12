import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Snackbar
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import { URL } from '../../../../config';
import ParentCard from '../../shared/ParentCard';
import CustomFormLabel from '../theme-elements/CustomFormLabel';
import CustomTextField from '../theme-elements/CustomTextField';
  
  const CrearMunicipioForm = () => {
    const navigate = useNavigate();
    const [departamentos, setDepartamentos] = useState([]);
    const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
  
    useEffect(() => {
      const fetchDepartamentos = async () => {
        try {
          const response = await fetch(`${URL}departamentos`);
          const data = await response.json();
          setDepartamentos(data);
        } catch (error) {
          console.error('Error al obtener los departamentos:', error);
        }
      };
  
      fetchDepartamentos();
    }, []);
  
    const handleSave = async (values) => {
      try {
        const response = await fetch(`${URL}municipios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
  
        if (response.ok) {
          setAlert({ open: true, message: 'Municipio creado con éxito', severity: 'success' });
          navigate('/DepartamentosMunicipios');
        } else {
          setAlert({ open: true, message: 'Error al crear el municipio', severity: 'error' });
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
        setAlert({ open: true, message: 'Error al llamar a la API', severity: 'error' });
      }
    };
  
    const validationSchema = yup.object({
      nombre: yup.string().required('El nombre del municipio es necesario'),
      id_departamento: yup.number().required('Seleccione un departamento'),
    });
  
    const formik = useFormik({
      initialValues: {
        nombre: '',
        id_departamento: '',
      },
      validationSchema,
      onSubmit: (values) => {
        handleSave(values);
      },
    });
  
    return (
      <ParentCard title="Crear Municipio">
        <form onSubmit={formik.handleSubmit}>
          <CustomFormLabel htmlFor="nombre">Nombre del municipio</CustomFormLabel>
          <CustomTextField
            id="nombre"
            name="nombre"
            variant="outlined"
            fullWidth
            value={formik.values.nombre}
            onChange={formik.handleChange}
            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
            helperText={formik.touched.nombre && formik.errors.nombre}
          />
  
          <CustomFormLabel htmlFor="id_departamento">Departamento</CustomFormLabel>
          <FormControl fullWidth>
            <InputLabel id="departamento-label">Seleccione un departamento</InputLabel>
            <Select
              labelId="departamento-label"
              id="id_departamento"
              name="id_departamento"
              value={formik.values.id_departamento}
              onChange={formik.handleChange}
              input={<OutlinedInput label="Seleccione un departamento" />}
              error={formik.touched.id_departamento && Boolean(formik.errors.id_departamento)}
            >
              {departamentos.map((departamento) => (
                <MenuItem key={departamento.id} value={departamento.id}>
                  {departamento.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={!formik.isValid || formik.isSubmitting}
            sx={{ mt: 2 }}
          >
            Guardar
          </Button>
        </form>
  
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={() => setAlert({ ...alert, open: false })}
        >
          <Alert
            onClose={() => setAlert({ ...alert, open: false })}
            severity={alert.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </ParentCard>
    );
  };
  
  export default CrearMunicipioForm;
  