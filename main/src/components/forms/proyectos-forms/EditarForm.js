import { Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { URL } from "../../../../config";
import ParentCard from '../../shared/ParentCard';
import CustomFormLabel from '../theme-elements/CustomFormLabel';
import CustomTextField from '../theme-elements/CustomTextField';

const ProyectosEditarForm = () => {
const { id } = useParams ();
  const navigate = useNavigate();
  const [data, setData] = useState({
    id: 0,
    nombre: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    presupuesto: "",
  });
  
  const [loading, setLoading] = useState(true); // Estado de carga
  
  // Obtener los datos del proyecto cuando el componente se monta
  useEffect(() => {
    
      console.log('Buscando proyecto con id:', id);
      const fetchProyectos = async () => {
        try {
          const response = await axios.get(`${URL}proyectos/${id}`);
          setData(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error al obtener proyecto:", error);
          setLoading(false);
        }
      };
      
      fetchProyectos();
    
  }, [id]);

  // Manejar el cambio de los campos del formulario
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setData({ ...data, [id]: value });
  };

  // Manejar el cambio en el campo de presupuesto
  const handlePresupuestoChange = (e) => {
    const valor = e.target.value;
    // Solo permitimos que se ingrese un número con máximo 2 decimales
    const regex = /^Q?\s?(\d+(\.\d{0,2})?)?$/;
    if (regex.test(valor)) {
      setData({ ...data, presupuesto: valor.startsWith("Q") ? valor : `Q ${valor}` });
    }
  };

  // Manejar la actualización del proyecto
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${URL}proyectos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: data.nombre,
          descripcion: data.descripcion,
          fecha_inicio: data.fecha_inicio,
          fecha_fin: data.fecha_fin,
          presupuesto: data.presupuesto,
        }),
      });

      if (response.ok) {
        alert('Proyecto actualizado con éxito');
        navigate('/pages/proyectos');  // Redirige a la lista de proyectos
      } else {
        alert('Error al actualizar el proyecto');
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      alert('Error al llamar a la API');
    }
  };

  if (loading) return <div>Cargando...</div>;  // Muestra un mensaje mientras se cargan los datos

  return (
    <ParentCard title="Editar Proyecto - Actualizar datos">
      <form onSubmit={handleUpdate}>
        {/* Nombre del Proyecto */}
        <CustomFormLabel htmlFor="nombre">Nombre del Proyecto</CustomFormLabel>
        <CustomTextField
          id="nombre"
          variant="outlined"
          fullWidth
          value={data.nombre}
          onChange={handleInputChange}
        />

        {/* Descripción */}
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

        {/* Fecha de Inicio */}
        <CustomFormLabel htmlFor="fecha_inicio">Fecha Inicio</CustomFormLabel>
        <CustomTextField
          type="date"
          id="fecha_inicio"
          fullWidth
          value={data.fecha_inicio}
          onChange={handleInputChange}
        />

        {/* Fecha Final */}
        <CustomFormLabel htmlFor="fecha_fin">Fecha Final</CustomFormLabel>
        <CustomTextField
          type="date"
          id="fecha_fin"
          fullWidth
          value={data.fecha_fin}
          onChange={handleInputChange}
        />

        {/* Presupuesto */}
        <CustomFormLabel htmlFor="presupuesto">Presupuesto</CustomFormLabel>
        <CustomTextField
          id="presupuesto"
          variant="outlined"
          fullWidth
          value={data.presupuesto}
          onChange={handlePresupuestoChange}
        />

        <br /><br />
        <div>
          <Button type="submit" color="primary" variant="contained">
            Guardar
          </Button>
        </div>
      </form>
    </ParentCard>
  );
};

export default ProyectosEditarForm;
