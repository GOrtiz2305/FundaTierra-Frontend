import {
  Alert,
  Button,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { URL } from '../../../../../config';
import ParentCard from '../../../shared/ParentCard';
import CustomSelect from '../../theme-elements/CustomSelect';

const VerPresupuestoForm = ({ id }) => {

  const [subcategorias, setSubcategorias] = useState([]);
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

    const fetchSubcategorias = async () => {
      try {
        const response = await fetch(`${URL}subcategorias`);
        if (response.ok) {
          const data = await response.json();
          setSubcategorias(data);
        } else {
          console.error('Error al obtener las subcategorias');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    fetchSubcategorias();
    fetchPresupuesto();
  }, [id]);

  return (
    <ParentCard title="Formulario de Presupuesto">
      <Alert severity="info">I. Detalle del presupuesto</Alert>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Subcategoria</TableCell>
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
                <TableCell style={{ width: '20%' }}>
                  <CustomSelect
                    id="subcategoria"
                    name="subcategoria"
                    value={item.subcategoria}
                    disabled
                    fullWidth
                    variant="outlined"
                  >
                    {subcategorias.map((subcategoria) => (
                      <MenuItem key={subcategoria.id} value={subcategoria.id}>
                        {subcategoria.nombre}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </TableCell>
                <TableCell style={{ width: '15%' }}>
                  <TextField
                    type="number"
                    value={item.unidades}
                    style={{ width: '100%' }}
                    InputProps={{ readOnly: true }}
                  />
                </TableCell>
                <TableCell style={{ width: '35%' }}>
                  <TextField
                    style={{ width: '100%' }}
                    value={item.descripcion}
                    InputProps={{ readOnly: true }}
                  />
                </TableCell>
                <TableCell style={{ width: '15%' }}>
                  <TextField
                    style={{ width: '100%' }}
                    type="number"
                    value={item.costoUnitario}
                    InputProps={{ readOnly: true }}
                  />
                </TableCell>
                <TableCell
                  style={{ width: '15%' }}
                  InputProps={{ readOnly: true }}>
                  Q{item.total}
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
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell>Q {presupuesto.contenido.total}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Alert severity="info" style={{ marginTop: '20px' }}>
        II. Información general
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
            InputProps={{ readOnly: true }}
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
            InputProps={{ readOnly: true }}
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
        InputProps={{ readOnly: true }}
        fullWidth
      />
      <br />
      <Button variant="contained" color="success" style={{ marginTop: '20px' }}>
        Aprobar documento
      </Button>
      <Button variant="contained" color="error" style={{ marginTop: '20px', marginLeft: '10px' }}>
        Solicitar correcciones
      </Button>
    </ParentCard>
  );
};

export default VerPresupuestoForm;
