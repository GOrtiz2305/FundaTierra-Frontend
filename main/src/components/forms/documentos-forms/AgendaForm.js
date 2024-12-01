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
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import { URL } from '../../../../config';
import ParentCard from '../../shared/ParentCard';
  
  const AgendaForm = () => {
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
      onSubmit: async (values) => {
        try {
          const agendaData = {
            ...values,
            puntosAgenda: agendaItems,
          };
  
          const response = await fetch(`${URL}documentos`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(agendaData),
          });
  
          if (response.ok) {
            alert('Agenda creada con éxito');
            navigate(-1);
          } else {
            alert('Error al crear la agenda');
          }
        } catch (error) {
          console.error('Error al guardar la agenda:', error);
        }
      },
    });
  
    const addAgendaItem = () => {
      setAgendaItems([...agendaItems, { horario: '', punto: '', responsablePunto: '' }]);
    };
  
    const handleAgendaItemChange = (index, field, value) => {
      const updatedItems = [...agendaItems];
      updatedItems[index][field] = value;
      setAgendaItems(updatedItems);
    };
  
    return (
      <ParentCard title="Formulario de Agenda">
        <form onSubmit={formik.handleSubmit}>
          <Alert severity="info">I. Detalles de la Actividad</Alert>
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
  
          <Alert severity="info">II. Puntos de la Agenda</Alert>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Horario</TableCell>
                <TableCell>Punto de Agenda</TableCell>
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
                      onChange={(e) => handleAgendaItemChange(index, 'horario', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={item.punto}
                      onChange={(e) => handleAgendaItemChange(index, 'punto', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={item.responsablePunto}
                      onChange={(e) => handleAgendaItemChange(index, 'responsablePunto', e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={addAgendaItem} variant="contained" color="primary" style={{ marginTop: '10px' }}>
            Agregar Punto
          </Button>
  
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: '20px' }}
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Guardar Agenda
          </Button>
        </form>
      </ParentCard>
    );
  };
  
  export default AgendaForm;
  