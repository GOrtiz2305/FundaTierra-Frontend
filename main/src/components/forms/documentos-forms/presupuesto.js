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
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import { URL } from '../../../../config';
import ParentCard from '../../shared/ParentCard';

const PresupuestoForm = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

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

  const formik = useFormik({
    initialValues: {
      solicitante: '',
      autorizador: '',
      observaciones: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const presupuestoData = {
          ...values,
          items,
        };

        const response = await fetch(`${URL}presupuestos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(presupuestoData),
        });

        if (response.ok) {
          alert('Presupuesto creado con éxito');
          navigate(-1);
        } else {
          alert('Error al crear el presupuesto');
        }
      } catch (error) {
        console.error('Error al guardar el presupuesto:', error);
      }
    },
  });

  const addItem = () => {
    setItems([...items, { unidades: '', descripcion: '', costoUnitario: '', total: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    // Calcular total del item
    if (field === 'unidades' || field === 'costoUnitario') {
      updatedItems[index].total =
        (updatedItems[index].unidades || 0) * (updatedItems[index].costoUnitario || 0);
    }

    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
  };

  return (
    <ParentCard title="Formulario de Presupuesto">
      <form onSubmit={formik.handleSubmit}>
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
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.unidades}
                    onChange={(e) => handleItemChange(index, 'unidades', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={item.descripcion}
                    onChange={(e) => handleItemChange(index, 'descripcion', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.costoUnitario}
                    onChange={(e) => handleItemChange(index, 'costoUnitario', e.target.value)}
                  />
                </TableCell>
                <TableCell>{item.total}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell>{calculateTotal()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button onClick={addItem} variant="contained" color="primary" style={{ marginTop: '10px' }}>
          Agregar Item
        </Button>

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
              onChange={formik.handleChange}
              value={formik.values.solicitante}
              error={formik.touched.solicitante && Boolean(formik.errors.solicitante)}
              helperText={formik.touched.solicitante && formik.errors.solicitante}
              fullWidth
            />
          </Grid>
          <Grid item lg={6} md={12}>
            <CustomFormLabel htmlFor="autorizador">Autorizador</CustomFormLabel>
            <TextField
              id="autorizador"
              name="autorizador"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.autorizador}
              error={formik.touched.autorizador && Boolean(formik.errors.autorizador)}
              helperText={formik.touched.autorizador && formik.errors.autorizador}
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
          onChange={formik.handleChange}
          value={formik.values.observaciones}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
          disabled={!formik.isValid || formik.isSubmitting}
        >
          Guardar Presupuesto
        </Button>
      </form>
    </ParentCard>
  );
};

export default PresupuestoForm;
