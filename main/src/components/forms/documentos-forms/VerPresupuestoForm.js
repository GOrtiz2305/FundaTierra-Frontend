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
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as yup from 'yup';
import { URL } from '../../../../config';
import ParentCard from '../../shared/ParentCard';

const VerPresupuestoForm = ({ id }) => {

  const [presupuesto, setPresupuesto] = useState({
    id: 0,
    solicitante: '',
    autorizador: '',
    observaciones: '',
    puntos_presupuesto: [],
    contenido: {},
  });

  const CustomFormLabel = styled((props) => (
    <Typography variant="subtitle1" fontWeight={600} {...props} component="label" />
  ))(() => ({
    marginBottom: '5px',
    marginTop: '25px',
    display: 'block',
  }));

  const validationSchema = yup.object({
    solicitante: yup.string().required('El solicitante es obligatorio'),
    autorizador: yup.string().required('El autorizador es obligatorio'),
  });

  useEffect(() => {
    const fetchPresupuesto = async () => {
      try {
        const response = await fetch(`${URL}api/documentos/${id}/14`);
        if (response.ok) {
          const data = await response.json();
          setPresupuesto(data);
        } else {
          console.error('Error al obtener el presupuesto');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    fetchPresupuesto();
  }, [id]);

  return (
    <ParentCard title="Formulario de Presupuesto">
      <Alert severity="info">I. Detalle del Presupuesto</Alert>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Unidades</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Costo Unitario</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {presupuesto.contenido.puntos_presupuesto && presupuesto.contenido.puntos_presupuesto.length > 0 ? (
            presupuesto.contenido.puntos_presupuesto.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.unidades}
                    style={{ width: '100%' }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    style={{ width: '100%' }}
                    value={item.descripcion}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    style={{ width: '100%' }}
                    type="number"
                    value={item.costoUnitario}
                  />
                </TableCell>
                <TableCell>Q{item.total}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No hay puntos en la agenda.
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell>Q {presupuesto.contenido.total}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Alert severity="info" style={{ marginTop: '20px' }}>
        II. Información General
      </Alert>
      <Grid container spacing={3} mb={3}>
        <Grid item lg={6} md={12}>
          <CustomFormLabel htmlFor="solicitante">Solicitante</CustomFormLabel>
          <TextField
            id="solicitante"
            name="solicitante"
            variant="outlined"
            value={presupuesto.contenido.solicitante}
            fullWidth
          />
        </Grid>
        <Grid item lg={6} md={12}>
          <CustomFormLabel htmlFor="autorizador">Autorizador</CustomFormLabel>
          <TextField
            id="autorizador"
            name="autorizador"
            variant="outlined"
            value={presupuesto.contenido.autorizador}
            fullWidth
          />
        </Grid>
      </Grid>

      <CustomFormLabel htmlFor="observaciones">Observaciones</CustomFormLabel>
      <TextField
        id="observaciones"
        name="observaciones"
        multiline
        rows={4}
        variant="outlined"
        value={presupuesto.contenido.observaciones}
        disabled
        fullWidth
      />
    </ParentCard>
  );
};

export default VerPresupuestoForm;
