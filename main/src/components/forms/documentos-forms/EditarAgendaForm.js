import React, { useState, useEffect } from 'react';
import {
  Button,
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
import ParentCard from '../../shared/ParentCard';
import { URL } from "../../../../config";
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router';

const EditarAgendaForm = ({ id }) => {

  const navigate = useNavigate();

  const [actividad, setActividad] = useState(
    {
      nombre: ""
    }
  );

  const validationSchema = yup.object({
    actividad: yup.string().required('La actividad es obligatoria'),
    lugar: yup.string().required('El lugar es obligatorio'),
    fecha: yup.string().required('La fecha es obligatoria'),
    responsable: yup.string().required('El responsable es obligatorio'),
  });

  const [agenda, setAgenda] = useState({
    id: 0,
    nombre: '',
    lugar: '',
    fecha: '',
    responsable: '',
    puntos_agenda: [{}],
    contenido: {
    },
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Actualizar el estado de la memoria con los nuevos valores y de memoria.contenido
    setAgenda({
      ...agenda,
      [id]: value,
      contenido: {
        ...agenda.contenido,
        [id]: value,
      },
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        contenido: {
          fecha: agenda.contenido.fecha,
          lugar: agenda.contenido.lugar,
          responsable: agenda.contenido.responsable,
          puntos_agenda: agenda.contenido.puntos_agenda,
        },
        nombre: agenda.nombre,
      };

      const response = await fetch(`${URL}documentos/${agenda.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        <Alert variant="filled" severity="success">
          Agenda actualizada con éxito
        </Alert>
      } else {
        <Alert variant='filled' severity='error'>
          Error al actualizar la agenda
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
      responsable: '',
      puntos_agenda: []
    },
    validationSchema,
    onSubmit: (values) => {
      handleSave(values); // Llamar a handleSave con los valores del formulario si es válido
    },
  });


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

  const addAgendaItem = () => {
    setAgenda((prevAgenda) => ({
      ...prevAgenda,
      contenido: {
        ...prevAgenda.contenido,
        puntos_agenda: [
          ...prevAgenda.contenido.puntos_agenda,
          { horario: '', punto: '', responsablePunto: '' },
        ],
      },
    }));
  };

  const removeAgendaItem = (index) => {
    const updatedItems = agenda.contenido.puntos_agenda.filter((_, i) => i !== index);
    setAgenda((prevAgenda) => ({
      ...prevAgenda,
      contenido: {
        ...prevAgenda.contenido,
        puntos_agenda: updatedItems,
      },
    }));
  };

  const handleAgendaItemChange = (index, field, value) => {
    const updatedItems = [...agenda.contenido.puntos_agenda];
    updatedItems[index][field] = value;
    setAgenda((prevAgenda) => ({
      ...prevAgenda,
      contenido: {
        ...prevAgenda.contenido,
        puntos_agenda: updatedItems,
      },
    }));
  };

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
      <form onSubmit={handleUpdate}>
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
                      value={item.horario || ''}
                      style={{ width: '100%' }}
                      onChange={(e) => handleAgendaItemChange(index, 'horario', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={item.punto || ''}
                      style={{ width: '100%' }}
                      onChange={(e) => handleAgendaItemChange(index, 'punto', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={item.responsablePunto || ''}
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

        <Button onClick={addAgendaItem} variant="contained" color="secondary" style={{ marginTop: '10px' }}>
          Agregar Punto
        </Button>
        <br /><br />
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

export default EditarAgendaForm;
