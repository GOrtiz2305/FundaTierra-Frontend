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
import { useNavigate, useParams } from 'react-router';
import * as yup from 'yup';
import { URL } from '../../../../config';
import ParentCard from '../../shared/ParentCard';

const PresupuestoForm = () => {
  const id = useParams();
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

  const handleSave = async (values) => {
    try {
      const dataEncapsulada = {
        solicitante: values.solicitante,
        autorizador: values.autorizador,
        observaciones: values.observaciones,
        puntos_presupuesto: items,
        total: calculateTotal(),
      };

      const dataNoEncapsulada = {
        nombre: "Presupuesto" ,
        id_tipo: 14,
        id_estado: 1,
        id_actividad: Number(id.id),
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
          Presupuesto creado con éxito
        </Alert>
      } else {
        <Alert variant='filled' severity='error'>
          Error al crear el presupuesto
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
      solicitante: '',
      autorizador: '',
      observaciones: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      handleSave(values);
    },
  });

  const addItem = () => {
    setItems([...items, { unidades: '', descripcion: '', costoUnitario: '', total: '' }]);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index); // Filtra los elementos excepto el indicado
    setItems(updatedItems); // Actualiza el estado
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
  
    // Calcular el total si los campos necesarios están presentes
    if (field === 'unidades' || field === 'costoUnitario') {
      const unidades = parseFloat(updatedItems[index].unidades) || 0;
      const costoUnitario = parseFloat(updatedItems[index].costoUnitario) || 0;
      updatedItems[index].total = (unidades * costoUnitario).toFixed(2);
    }
  
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
  };

  return (
    <ParentCard title="Formulario de Presupuesto">
      <form onSubmit={formik.handleSubmit}>
        <Alert severity="info">I. Detalle del presupuesto</Alert>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Unidades</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Costo unitario</TableCell>
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
                    style={{ width: '100%' }}
                    onChange={(e) => handleItemChange(index, 'unidades', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    style={{ width: '100%' }}
                    value={item.descripcion}
                    onChange={(e) => handleItemChange(index, 'descripcion', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    style={{ width: '100%' }}
                    type="number"
                    value={item.costoUnitario}
                    onChange={(e) => handleItemChange(index, 'costoUnitario', e.target.value)}
                  />
                </TableCell>
                <TableCell>Q{item.total}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => removeItem(index)} // Llama a la función para eliminar el ítem
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell>Q {calculateTotal()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button onClick={addItem} variant="contained" color="secondary" style={{ marginTop: '10px' }}>
          Agregar item
        </Button>

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
          Guardar
        </Button>
      </form>
    </ParentCard>
  );
};

export default PresupuestoForm;
