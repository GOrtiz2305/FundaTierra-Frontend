import React, { useEffect, useState } from 'react';
import {
  Button,
  MenuItem,
  Select,
} from '@mui/material';
import CustomTextField from '../theme-elements/CustomTextField';
import CustomFormLabel from '../theme-elements/CustomFormLabel';
import ParentCard from '../../shared/ParentCard';
import { URL } from "../../../../config";
import axios from 'axios';
import { useNavigate } from 'react-router';

const ActividadesEditarForm = ({ id }) => {
  const [proyectos, setProyectos] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const navigate = useNavigate();
  const [data, setData] = useState({
    id: 0,
    fecha_inicio: "",
    nombre: "",
    descripcion: "",
    id_proyectos: "",
    id_direccion: "",
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

    const fetchDirecciones = async () => {
      try {
        const response = await fetch(`${URL}direcciones`);
        if (response.ok) {
          const data = await response.json();
          setDirecciones(data);
        } else {
          console.error('Error al obtener las direcciones');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    if (id) {
      fetchActividades();
    }

    fetchProyectos();
    fetchDirecciones();
  }, [id]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setData({ ...data, [id]: value });
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
            id_direccion: data.id_direccion,
          }
        ),
      });

      if (response.ok) {
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
    <ParentCard title='Formulario de Actividades - Actualización de datos'>
      <form onSubmit={handleUpdate}>
        <CustomFormLabel htmlFor="fecha_inicio">Fecha</CustomFormLabel>
        <CustomTextField
          id="fecha_inicio"
          type="date"
          fullWidth
          value={data.fecha_inicio}
          onChange={handleInputChange}
        />
        <CustomFormLabel htmlFor="nombre">Nombre de la Actividad</CustomFormLabel>
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
        <CustomFormLabel htmlFor="id_proyecto">Proyecto</CustomFormLabel>
        <Select
          id="id_proyecto"
          fullWidth
          variant="outlined"
          value={data.id_proyectos}
          onChange={(e) => setData({ ...data, id_proyectos: e.target.value })}
        >
          {proyectos.map((proyecto) => (
            <MenuItem key={proyecto.id} value={proyecto.id}>
              {proyecto.nombre}
            </MenuItem>
          ))}
        </Select>
        <CustomFormLabel htmlFor="id_direccion">Dirección</CustomFormLabel>
        <Select
          id="id_direccion"
          fullWidth
          variant="outlined"
          value={data.id_direccion}
          onChange={(e) => setData({ ...data, id_direccion: e.target.value })}
        >
          {direcciones.map((direccion) => (
            <MenuItem key={direccion.id} value={direccion.id}>
              {direccion.detalle}
            </MenuItem>
          ))}
        </Select>
        <br /> <br />
        <Button color="primary" variant="contained" type="submit">
          Guardar
        </Button>
      </form>
    </ParentCard>
  );
};

export default ActividadesEditarForm;
