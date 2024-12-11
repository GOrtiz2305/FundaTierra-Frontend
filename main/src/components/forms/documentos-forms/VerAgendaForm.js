import React, { useState, useEffect, memo } from 'react';
import {
  Button,
  FormHelperText,
  MenuItem,
  Select,
  Typography,
  Alert,
  Grid,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import CustomTextField from '../theme-elements/CustomTextField';
import ParentCard from '../../shared/ParentCard';
import { URL } from "../../../../config";
import * as yup from 'yup';
import { useFormik } from 'formik';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import esLocale from 'date-fns/locale/es';

const VerAgendaForm = ({ id }) => {
  const [actividad, setActividad] = useState(
    {
      nombre: ""
    }
  );

  const [agenda, setAgenda] = useState({
    id: 0,
    nombre: '',
    lugar: '',
    fecha: '',
    responsable: '',
    puntos_agenda: [],
    contenido: {
    },
  });

  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchActividad = async () => {
      try {
        const response = await fetch(`${URL}actividades/${id}`);
        if (response.ok) {
          const data = await response.json();
          setActividad(data);
        } else {
          console.error('Error al obtener la actividad');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    const fetchAgenda = async () => {
      try {
        const response = await fetch(`${URL}api/documentos/${id}/13`);
        if (response.ok) {
          const data = await response.json();
          setAgenda(data);
        } else {
          console.error('Error al obtener la agenda');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    if (id) {
      fetchAgenda();
    }

    fetchActividad();
  }, [id]);

  return (
    <ParentCard title="Agenda">
      <Alert severity="info">I. Detalles de la Actividad</Alert>
      <Grid container spacing={3} mb={3}>
        <Grid item lg={6} md={12}>
          <CustomFormLabel htmlFor="actividad">Actividad</CustomFormLabel>
          <TextField
            id="actividad"
            name="actividad"
            variant="outlined"
            value={actividad.nombre}
            fullWidth
          />
        </Grid>
        <Grid item lg={6} md={12}>
          <CustomFormLabel htmlFor="lugar">Lugar</CustomFormLabel>
          <TextField
            id="lugar"
            name="lugar"
            variant="outlined"
            value={agenda.contenido.lugar}
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
            value={agenda.contenido.fecha}
            fullWidth
          />
        </Grid>
        <Grid item lg={6} md={12}>
          <CustomFormLabel htmlFor="responsable">Responsable</CustomFormLabel>
          <TextField
            id="responsable"
            name="responsable"
            variant="outlined"
            value={agenda.contenido.responsable}
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
          {agenda.contenido.puntos_agenda && agenda.contenido.puntos_agenda.length > 0 ? (
            agenda.contenido.puntos_agenda.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    type="time"
                    value={item.horario}
                    style={{ width: '100%' }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={item.punto}
                    style={{ width: '100%' }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={item.responsablePunto}
                    style={{ width: '100%' }}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No hay puntos en la agenda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ParentCard>
  );
};

export default VerAgendaForm;
