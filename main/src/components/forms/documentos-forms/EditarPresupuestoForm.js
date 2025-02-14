import {
  Alert,
  Autocomplete,
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
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import { URL } from '../../../../config';
import ParentCard from '../../shared/ParentCard';
import { useFormik } from 'formik';

const EditarPresupuestoForm = ({ id }) => {

  const [subcategorias, setSubcategorias] = useState([]);
  const navigate = useNavigate();

  const [presupuesto, setPresupuesto] = useState({
    id: 0,
    solicitante: '',
    autorizador: '',
    observaciones: '',
    puntos_presupuesto: [],
    contenido: {},
    total: 0,
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

  const validationSchemaSubcategoria = yup.object({
    subcategoria: yup.number()
      .required('Seleccione una subcategoria'),
  });

  const formikSubcategoria = useFormik({
    initialValues: {
      subcategoria: 0,
    },
    validationSchema: validationSchemaSubcategoria
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

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setPresupuesto({
      ...presupuesto,
      [id]: value,
      contenido: {
        ...presupuesto.contenido,
        [id]: value,
      },
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        contenido: {
          solicitante: presupuesto.contenido.solicitante,
          autorizador: presupuesto.contenido.autorizador,
          observaciones: presupuesto.contenido.observaciones,
          puntos_presupuesto: presupuesto.contenido.puntos_presupuesto,
          total: presupuesto.contenido.total,
        },
        nombre: presupuesto.nombre,
      };

      const response = await fetch(`${URL}documentos/${presupuesto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        <Alert variant="filled" severity="success">
          Presupuesto actualizado con éxito
        </Alert>
      } else {
        <Alert variant='filled' severity='error'>
          Error al actualizar el presupuesto
        </Alert>
      }

      //Ir a la pagina anterior
      navigate(-1);
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      alert('Error al llamar a la API');
    }
  };

  const addPresupuestoItem = () => {
    setPresupuesto((prevPresupuesto) => ({
      ...prevPresupuesto,
      contenido: {
        ...prevPresupuesto.contenido,
        puntos_presupuesto: [
          ...prevPresupuesto.contenido.puntos_presupuesto,
          { subcategoria: '', unidades: '', descripcion: '', costoUnitario: '', total: '' },
        ],
      },
    }));
  };

  const removePresupuestoItem = (index) => {
    const updatedItems = presupuesto.contenido.puntos_presupuesto.filter((_, i) => i !== index);
    setPresupuesto((prevPresupuesto) => ({
      ...prevPresupuesto,
      contenido: {
        ...prevPresupuesto.contenido,
        puntos_presupuesto: updatedItems,
      },
    }));
  };

  const handlePresupuestoItemChange = (index, field, value) => {
    const updatedItems = [...presupuesto.contenido.puntos_presupuesto];
    updatedItems[index][field] = value;

    //Guardar solo el id de la subcategoria
    if (field === 'subcategoria') {
      updatedItems[index].subcategoria = value ? value.id : null;
    } else {
      updatedItems[index][field] = value;
    }

    // Recalcular el total si se actualizan unidades o costoUnitario
    if (field === 'unidades' || field === 'costoUnitario') {
      const unidades = parseFloat(updatedItems[index].unidades) || 0;
      const costoUnitario = parseFloat(updatedItems[index].costoUnitario) || 0;
      updatedItems[index].total = (unidades * costoUnitario).toFixed(2);
    }

    console.log(updatedItems);
    // Recalcular el total general
    const totalGeneral = updatedItems.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
    
    setPresupuesto((prevPresupuesto) => ({
      ...prevPresupuesto,
      contenido: {
        ...prevPresupuesto.contenido,
        puntos_presupuesto: updatedItems,
        total: totalGeneral.toFixed(2),
      },
    }));
  };

  return (
    <ParentCard title="Formulario de Presupuesto">
      <form onSubmit={handleUpdate}>
        <Alert severity="info">I. Detalle del presupuesto</Alert>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subcategoría</TableCell>
              <TableCell>Unidades</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Costo unitario</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {presupuesto.contenido.puntos_presupuesto && presupuesto.contenido.puntos_presupuesto.length > 0 ? (
              presupuesto.contenido.puntos_presupuesto.map((item, index) => (
                <TableRow key={index}>
                  <TableCell style={{ width: '20%' }}>
                    <Autocomplete
                      id="subcategoria"
                      options={subcategorias.filter(
                        (option) => !presupuesto.contenido.puntos_presupuesto.some((p) => p.subcategoria === option.id)
                      )}
                      getOptionLabel={(option) => option?.nombre || ''}
                      value={subcategorias.find((s) => s.id === item.subcategoria) || null}
                      onChange={(event, newValue) => {
                        formikSubcategoria.setFieldValue('subcategoria', newValue ? newValue.id : null);
                        handlePresupuestoItemChange(index, 'subcategoria', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          error={formikSubcategoria.touched.subcategoria && Boolean(formikSubcategoria.errors.subcategoria)}
                          helperText={formikSubcategoria.touched.subcategoria && formikSubcategoria.errors.subcategoria}
                          onBlur={formikSubcategoria.handleBlur}
                        />
                      )}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell style={{ width: '10%' }}>
                    <TextField
                      type="number"
                      value={item.unidades}
                      style={{ width: '100%' }}
                      onChange={(e) => handlePresupuestoItemChange(index, 'unidades', e.target.value)}
                    />
                  </TableCell>
                  <TableCell style={{ width: '30%' }}>
                    <TextField
                      style={{ width: '100%' }}
                      value={item.descripcion}
                      onChange={(e) => handlePresupuestoItemChange(index, 'descripcion', e.target.value)}
                    />
                  </TableCell>
                  <TableCell style={{ width: '15%' }}>
                    <TextField
                      style={{ width: '100%' }}
                      type="number"
                      value={item.costoUnitario}
                      onChange={(e) => handlePresupuestoItemChange(index, 'costoUnitario', e.target.value)}
                    />
                  </TableCell>
                  <TableCell style={{ width: '10%' }}>Q{item.total}</TableCell>
                  <TableCell style={{ width: '15%' }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => removePresupuestoItem(index)}
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
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell>Q {presupuesto.contenido.total}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button onClick={addPresupuestoItem} variant="contained" color="secondary" style={{ marginTop: '10px' }}>
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
              value={presupuesto.contenido.solicitante}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
          onChange={handleInputChange}
          fullWidth
        />
        <br /><br />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
        >
          Guardar
        </Button>
      </form>
    </ParentCard >
  );
};

export default EditarPresupuestoForm;
