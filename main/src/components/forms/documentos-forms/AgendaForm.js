import {
  Alert,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as yup from 'yup';
import { URL } from '../../../../config';
import ParentCard from '../../shared/ParentCard';

const AgendaForm = () => {
  const id = useParams();
  const [agendaItems, setAgendaItems] = useState([]);
  const navigate = useNavigate();

  const CustomFormLabel = styled((props) => (
    <Typography variant="subtitle1" fontWeight={600} {...props} component="label" />
  ))(() => ({
    marginBottom: '5px',
    marginTop: '25px',
    display: 'block',
  }));

  const validationSchema = yup.object({
    actividad: yup.string().required('La actividad es obligatoria'),
    lugar: yup.string().required('El lugar es obligatorio'),
    fecha: yup.string().required('La fecha es obligatoria'),
    responsable: yup.string().required('El responsable es obligatorio'),
  });

  const handleSave = async (values) => {
    try {
      const dataEncapsulada = {
        lugar: values.lugar,
        fecha: values.fecha,
        responsable: values.responsable,
        puntos_agenda: agendaItems,
      };

      const dataNoEncapsulada = {
        id_actividad: Number(id.id),
        nombre: values.actividad,
        id_tipo: 13,
        id_estado: 1,
      };

      const dataToSend = {
        contenido: {
          ...dataEncapsulada,
        },
        ...dataNoEncapsulada,
      };

      console.log(dataToSend);
      const response = await fetch(`${URL}documentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        <Alert variant="filled" severity="success">
          Agenda creada con éxito
        </Alert>
      } else {
        <Alert variant='filled' severity='error'>
          Error al crear la agenda
        </Alert>
      }

      //Ir a la pagina anterior
      navigate(-1);
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      alert('Error al llamar a la API');
    }
  };

  const formik = useFormik({
    initialValues: {
      actividad: '',
      lugar: '',
      fecha: '',
      proyecto: '',
      rubro: '',
      responsable: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleSave(values); // Llamar a handleSave con los valores del formulario si es válido
    },
  });

  const addAgendaItem = () => {
    setAgendaItems([...agendaItems, { horario: '', punto: '', responsablePunto: '' }]);
  };

  const removeAgendaItem = (index) => {
    const updatedItems = agendaItems.filter((_, i) => i !== index); // Filtra los elementos excepto el indicado
    setAgendaItems(updatedItems); // Actualiza el estado con los elementos restantes
  };

  const handleAgendaItemChange = (index, field, value) => {
    const updatedItems = [...agendaItems];
    updatedItems[index][field] = value;
    setAgendaItems(updatedItems);
  };

  return (
    <ParentCard title="Formulario de Agenda">
      <form onSubmit={formik.handleSubmit}>
        <Alert severity="info">I. Detalles de la actividad</Alert>
        <Grid container spacing={3} mb={3}>
          <Grid item lg={6} md={12}>
            <CustomFormLabel htmlFor="actividad">Actividad</CustomFormLabel>
            <TextField
              id="actividad"
              name="actividad"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.actividad}
              error={formik.touched.actividad && Boolean(formik.errors.actividad)}
              helperText={formik.touched.actividad && formik.errors.actividad}
              fullWidth
            />
          </Grid>
          <Grid item lg={6} md={12}>
            <CustomFormLabel htmlFor="lugar">Lugar</CustomFormLabel>
            <TextField
              id="lugar"
              name="lugar"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.lugar}
              error={formik.touched.lugar && Boolean(formik.errors.lugar)}
              helperText={formik.touched.lugar && formik.errors.lugar}
              fullWidth
            />
          </Grid>
          <Grid item lg={6} md={12}>
            <CustomFormLabel htmlFor="fecha">Fecha</CustomFormLabel>
            <TextField
              id="fecha"
              name="fecha"
              type="date"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.fecha}
              error={formik.touched.fecha && Boolean(formik.errors.fecha)}
              helperText={formik.touched.fecha && formik.errors.fecha}
              fullWidth
            />
          </Grid>
          <Grid item lg={6} md={12}>
            <CustomFormLabel htmlFor="responsable">Responsable</CustomFormLabel>
            <TextField
              id="responsable"
              name="responsable"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.responsable}
              error={formik.touched.responsable && Boolean(formik.errors.responsable)}
              helperText={formik.touched.responsable && formik.errors.responsable}
              fullWidth
            />
          </Grid>
        </Grid>

        <Alert severity="info">II. Puntos de la agenda</Alert>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Horario</TableCell>
              <TableCell>Punto de agenda</TableCell>
              <TableCell>Responsable</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agendaItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    type="time"
                    value={item.horario}
                    style={{ width: '100%' }}
                    onChange={(e) => handleAgendaItemChange(index, 'horario', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={item.punto}
                    style={{ width: '100%' }}
                    onChange={(e) => handleAgendaItemChange(index, 'punto', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={item.responsablePunto}
                    style={{ width: '100%' }}
                    onChange={(e) => handleAgendaItemChange(index, 'responsablePunto', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => removeAgendaItem(index)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={addAgendaItem} variant="contained" color="secondary" style={{ marginTop: '10px' }}>
          Agregar punto
        </Button>

        <br /><br />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
          disabled={!formik.isValid || formik.isSubmitting}
        >
          Guardar agenda
        </Button>
      </form>
    </ParentCard>
  );
};

export default AgendaForm;
