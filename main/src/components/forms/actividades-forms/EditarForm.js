import {
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { URL } from "../../../../config";
import ParentCard from '../../shared/ParentCard';
import CustomFormLabel from '../theme-elements/CustomFormLabel';
import CustomSelect from '../theme-elements/CustomSelect';
import CustomTextField from '../theme-elements/CustomTextField';

const ActividadesEditarForm = ({ id }) => {
  const [proyectos, setProyectos] = useState([]);
  const [direccion, setDireccion] = useState([
    { id: 0, 
      detalle: "", 
      municipio: { 
        nombre: "",
        departamento : {
          nombre: ""
        }
      } 
    }
  ]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [actividadColaboradores, setActividadColaboradores] = useState([
    {
      id: 0,
      id_actividad: 0,
      id_usuario: 0,
      usuario: {
        id: 0,
        persona: {
          nombre: "",
          apellido: "",
        },
      },
    },
  ]);
  const [colaboradores, setColaboradores] = useState([]);
  const navigate = useNavigate();

  const [data, setData] = useState({
    id: 0,
    fecha_inicio: "",
    nombre: "",
    descripcion: "",
    id_proyectos: "",
    id_direccion: "",
    id_encargado: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const response = await axios.get(`${URL}actividades/${id}`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener actividades:", error);
        setLoading(false);
      }
    };

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

    const fetchColaboradores = async () => {
      try {
        const response = await fetch(`${URL}usuarios`);
        if (response.ok) {
          const data = await response.json();
          setColaboradores(data);
        } else {
          console.error('Error al obtener los colaboradores');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    const fetchActividadColaboradores = async () => {
      try {
        const response = await fetch(`${URL}actividadColaboradores/actividad/${id}`);
        if (response.ok) {
          const data = await response.json();
          setActividadColaboradores(data);
        } else {
          console.error('Error al obtener los colaboradores de la actividad');
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

    if (id) {
      fetchActividades();
      fetchActividadColaboradores();
    }

    fetchProyectos();
    fetchDepartamentos();
    fetchColaboradores();
  }, [id]);

  useEffect(() => {
    const fetchDireccion = async () => {
      try {
        const response = await fetch(`${URL}direcciones/${data.id_direccion}`);
        if (response.ok) {
          const data = await response.json();
          setDireccion(data);
        } else {
          console.error('Error al obtener la dirección');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    fetchDireccion();
  }, [data.id_direccion]);

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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setData({ ...data, [id]: value });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${URL}actividades/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            fecha_inicio: data.fecha_inicio,
            nombre: data.nombre,
            descripcion: data.descripcion,
            id_proyectos: data.id_proyectos,
            id_encargado: data.id_encargado,
          }
        ),
      });

      // Actualizar colaboradores
      const colaboradoresPorEnviar = (actividadColaboradores || []).map((colaborador) => ({
        id_colaborador: Number(colaborador.id_colaborador),
        id_actividad: Number(data.id),
      }));

      const responseColaboradores = await fetch(`${URL}actividadColaboradores/actividad/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(colaboradoresPorEnviar),
      });

      if (response.ok && responseColaboradores.ok) {
        alert('Actividad actualizada con éxito');
        navigate('/actividades');
      } else {
        alert('Error al actualizar la actividad');
      }

    } catch (error) {
      console.error('Error al llamar a la API:', error);
      alert('Error al llamar a la API');
    }
  };

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <ParentCard title='Formulario de actividades - Actualización de datos'>
      <form onSubmit={handleUpdate}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="fecha_inicio">Fecha</CustomFormLabel>
            <CustomTextField
              id="fecha_inicio"
              type="date"
              fullWidth
              value={data.fecha_inicio}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="id_proyecto">Proyecto</CustomFormLabel>
            <Select
              id="id_proyecto"
              fullWidth
              variant="outlined"
              value={data.id_proyectos}
              onChange={(e) => setData({ ...data, id_proyectos: e.target.value })}
              disabled
            >
              {proyectos.map((proyecto) => (
                <MenuItem key={proyecto.id} value={proyecto.id}>
                  {proyecto.nombre}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="id_encargado">Encargado</CustomFormLabel>
            <CustomSelect
              id="id_encargado"
              name="id_encargado"
              value={data.id_encargado}
              onChange={handleSelectChange}
              fullWidth
              variant="outlined"
            >
              {colaboradores.map((usuario) => (
                <MenuItem key={usuario.id} value={usuario.id}>
                  {usuario.persona.nombre} {usuario.persona.apellido}
                </MenuItem>
              ))}
            </CustomSelect>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="colaboradores">Colaboradores</CustomFormLabel>
            <FormControl fullWidth>
              <InputLabel id="colaboradores-label">Seleccione los colaboradores</InputLabel>
              <Select
                labelId="colaboradores-label"
                id="colaboradores"
                name="colaboradores"
                multiple
                value={actividadColaboradores.map(ac => ac.id_colaborador)}
                onChange={(e) => {
                  const selectedIds = e.target.value;
                  setActividadColaboradores(
                    selectedIds.map(id => ({
                      id_colaborador: id,
                      usuario: colaboradores.find(c => c.id === id) || { persona: { nombre: "", apellido: "" } }
                    }))
                  );
                }}
                input={<OutlinedInput id="select-multiple-chip" label="Seleccione los cooperantes" />}
                renderValue={(selected) => (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selected.map(id => {
                      const colaborador = colaboradores.find(c => c.id === id);
                      return (
                        <Chip key={id} label={colaborador ? `${colaborador.persona.nombre} ${colaborador.persona.apellido}` : 'Desconocido'} />
                      );
                    })}
                  </div>
                )}
              >
                {colaboradores.map((colaborador) => (
                  <MenuItem key={colaborador.id} value={colaborador.id}>
                    {colaborador.persona.nombre} {colaborador.persona.apellido}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <CustomFormLabel htmlFor="nombre">Nombre de la actividad</CustomFormLabel>
        <CustomTextField
          id="nombre"
          variant="outlined"
          fullWidth
          value={data.nombre}
          onChange={handleInputChange}
        />
        <CustomFormLabel htmlFor="descripcion">Descripción</CustomFormLabel>
        <CustomTextField
          id="descripcion"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={data.descripcion}
          onChange={handleInputChange}
        />

        <CustomFormLabel htmlFor="id_direccion">Dirección</CustomFormLabel>
        <CustomTextField
          id="id_direccion"
          variant="outlined"
          value={`${direccion?.detalle || ''}, ${direccion?.municipio?.nombre || ''}, ${direccion?.municipio?.departamento?.nombre || ''}`}
          fullWidth
          disabled
        />

        <br /> <br />
        <Button color="primary" variant="contained" type="submit">
          Guardar
        </Button>
      </form>
    </ParentCard>
  );
};

export default ActividadesEditarForm;
