import React, { useState, useEffect } from 'react';
import {
  Button,
  FormHelperText,
  MenuItem,
  Select,
  Typography,
  Grid,
  FormControl,
  OutlinedInput,
  Chip,
  InputLabel
} from '@mui/material';
import CustomTextField from '../theme-elements/CustomTextField';
import ParentCard from '../../shared/ParentCard';
import { URL } from "../../../../config";
import * as yup from 'yup';
import { useFormik } from 'formik';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router';

const ActividadesOrdinaryForm = () => {
  const [proyectos, setProyectos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const navigate = useNavigate();

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

  const CustomSelect = styled((props) => <Select {...props} />)(({ }) => ({}));

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await fetch(`${URL}proyectos`);
        if (response.ok) {
          const data = await response.json();
          setProyectos(data);
        } else {
          console.error('Error al obtener los proyectos');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    const fetchDepartamentos = async () => {
      try {
        const response = await fetch(`${URL}departamentos`);
        if (response.ok) {
          const data = await response.json();
          setDepartamentos(data);
        } else {
          console.error('Error al obtener los departamentos');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    const fetchUsuarios = async () => {
      try {
        const response = await fetch(`${URL}usuarios`);
        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);
        } else {
          console.error('Error al obtener los usuarios');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    fetchUsuarios();
    fetchProyectos();
    fetchDepartamentos();
  }, []);

  const handleSave = async (values) => {
    try {
      //Guardar direccion
      const dataPorEnviarDireccion = {
        detalle: values.detalle,
        id_municipio: values.id_municipio
      };

      const responseDireccion = await fetch(`${URL}direcciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataPorEnviarDireccion),
      });

      const dataDireccion = await responseDireccion.json();
      const idDireccion = dataDireccion.id;

      // Añadir id_usuario e id_estado a values antes de enviarlo
      const dataPorEnviar = {
        ...values,
        id_usuario: 3, // Define aquí el valor de id_usuario
        id_estado: 1,   // Define aquí el valor de id_estado
        id_direccion: idDireccion
      };

      const response = await fetch(`${URL}actividades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataPorEnviar),
      });

      const dataActividad = await response.json();
      const idActividad = dataActividad.id;

      //Colaboradores de la actividad
      const colaboradoresPorEnviar = formik.values.usuarios.map((idColaborador) => ({
        id_colaborador: Number(idColaborador),
        id_actividad: Number(idActividad),
      }));

      const responseColaboradores = await fetch(`${URL}actividadColaboradores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(colaboradoresPorEnviar),
      });

      if (response.ok && responseDireccion.ok && responseColaboradores.ok) {
        navigate('/actividades');
      }
      else {
        console.error('Error al guardar la actividad');
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      alert('Error al llamar a la API');
    }
  };

  const obtenerMunicipios = async (id_departamento) => {
    try {
      const response = await fetch(`${URL}municipios/departamento/${id_departamento}`);
      if (response.ok) {
        const data = await response.json();
        setMunicipios(data);
      } else {
        console.error('Error al obtener los municipios');
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
    }
  };

  const validationSchema = yup.object({
    nombre: yup.string().required('El nombre de la actividad es necesario'),
    id_proyectos: yup.string().required('El proyecto es necesario'),
    id_encargado: yup.string().required('El encargado es necesario'),
    detalle: yup.string().required('La dirección es necesaria'),
    id_municipio: yup.string().required('El municipio es necesario'),
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      id_proyectos: '',
      detalle: '',
      descripcion: '',
      fecha_inicio: '',
      id_encargado: '',
      id_municipio: '',
      id_departamento: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleSave(values); // Llamar a handleSave con los valores del formulario si es válido
      console.log(values);
    },
  });

  return (
    <ParentCard title='Formulario de Actividades - Información general'>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="fecha_inicio">Fecha</CustomFormLabel>
            <CustomTextField
              type="date"
              id="fecha_inicio"
              name="fecha_inicio"
              onChange={formik.handleChange}
              value={formik.values.fecha_inicio}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="id_proyectos">Proyecto</CustomFormLabel>
            <CustomSelect
              id="id_proyectos"
              name="id_proyectos"
              value={formik.values.id_proyectos}
              onChange={formik.handleChange}
              fullWidth
              variant="outlined"
            >
              {proyectos.map((proyecto) => (
                <MenuItem key={proyecto.id} value={proyecto.id}>
                  {proyecto.nombre}
                </MenuItem>
              ))}
            </CustomSelect>
            {formik.errors.id_proyectos && (
              <FormHelperText error>
                {formik.errors.id_proyectos}
              </FormHelperText>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="id_encargado">Encargado</CustomFormLabel>
            <CustomSelect
              id="id_encargado"
              name="id_encargado"
              value={formik.values.id_encargado}
              onChange={formik.handleChange}
              fullWidth
              variant="outlined"
            >
              {usuarios.map((usuario) => (
                <MenuItem key={usuario.id} value={usuario.id}>
                  {usuario.persona.nombre} {usuario.persona.apellido}
                </MenuItem>
              ))}
            </CustomSelect>
            {formik.errors.id_encargado && (
              <FormHelperText error>
                {formik.errors.id_encargado}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="usuarios">Colaboradores</CustomFormLabel>
            <FormControl fullWidth>
              <InputLabel id="usuarios-label">Seleccione a los colaboradores involucrados</InputLabel>
              <Select
                labelId="usuarios-label"
                id="usuarios"
                name="usuarios"
                multiple
                value={formik.values.usuarios || []}
                onChange={(e) => {
                  formik.setFieldValue("usuarios", e.target.value); // Actualiza correctamente los valores seleccionados
                }}
                input={<OutlinedInput id="select-multiple-chip" label="Seleccione los colaboradores" />}
                renderValue={(selected) => (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selected.map((usuarioId) => {
                      const usuario = usuarios.find((r) => r.id === usuarioId);
                      return <Chip key={usuarioId} label={usuario ? usuario.persona.nombre : ''} />;
                    })}
                  </div>
                )}
              >
                {usuarios.map((usuario) => (
                  <MenuItem key={usuario.id} value={usuario.id}>
                    {usuario.persona.nombre} {usuario.persona.apellido}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <CustomFormLabel htmlFor="id_departamento">Departamento</CustomFormLabel>
            <CustomSelect
              id="id_departamento"
              name="id_departamento"
              value={formik.values.id_departamento}
              onChange={(e) => {
                formik.handleChange(e);
                obtenerMunicipios(e.target.value);
              }}
              fullWidth
              variant="outlined"
            >
              {departamentos.map((departamento) => (
                <MenuItem key={departamento.id} value={departamento.id}>
                  {departamento.nombre}
                </MenuItem>
              ))}
            </CustomSelect>
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomFormLabel htmlFor="id_municipio">Municipio</CustomFormLabel>
            <CustomSelect
              id="id_municipio"
              name="id_municipio"
              value={formik.values.id_municipio}
              onChange={formik.handleChange}
              fullWidth
              variant="outlined"
            >
              {municipios.map((municipio) => (
                <MenuItem key={municipio.id} value={municipio.id}>
                  {municipio.nombre}
                </MenuItem>
              ))}
            </CustomSelect>
            {formik.errors.id_municipio && (
              <FormHelperText error>
                {formik.errors.id_municipio}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="detalle">Dirección</CustomFormLabel>
            <CustomTextField
              id="detalle"
              name="detalle"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.detalle}
              error={formik.touched.detalle && Boolean(formik.errors.detalle)}
              helperText={formik.touched.detalle && formik.errors.detalle}
              onBlur={formik.handleBlur}
              fullWidth
            />
          </Grid>
        </Grid>
        <CustomFormLabel htmlFor="nombre">Nombre de la Actividad</CustomFormLabel>
        <CustomTextField
          id="nombre"
          name="nombre"
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.nombre}
          error={formik.touched.nombre && Boolean(formik.errors.nombre)}
          helperText={formik.touched.nombre && formik.errors.nombre}
          onBlur={formik.handleBlur}
          fullWidth
        />

        <CustomFormLabel htmlFor="descripcion">Descripción</CustomFormLabel>
        <CustomTextField
          id="descripcion"
          name="descripcion"
          multiline
          rows={4}
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.descripcion}
          fullWidth
        />

        <br /><br />
        <div>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Guardar
          </Button>
        </div>
      </form>
    </ParentCard>
  );
};

export default ActividadesOrdinaryForm;
