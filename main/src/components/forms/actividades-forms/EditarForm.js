import {
  Button,
} from '@mui/material';
import CustomTextField from '../theme-elements/CustomTextField';
import CustomFormLabel from '../theme-elements/CustomFormLabel';
import ParentCard from '../../shared/ParentCard';
import CustomSelect from '../theme-elements/CustomSelect';
import { useEffect, useState } from 'react';

const ActividadesEditarForm = (id) => {

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const response = await axios.get(`${URL}actividades/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Error al obtener actividades:", error);
      }
    };
    fetchActividades();
  }, []);

  const [state, setState] = useState({
    checkedB: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const [value, setValue] = useState(null);

  return (
    <ParentCard title='Formulario de Actividades - Actualización de datos'>
      <form>
        <CustomFormLabel htmlFor="fecha_inicio">Fecha</CustomFormLabel>
        <CustomTextField type="date" id="fecha_inicio" fullWidth />
        <CustomFormLabel
          sx={{
            mt: 0,
          }}
          htmlFor="nombre"
        >
          Nombre de la Actividad
        </CustomFormLabel>
        <CustomTextField
          id="nombre"
          variant="outlined"
          fullWidth
          value={value}
        />
        <CustomFormLabel htmlFor="ordinary-outlined-password-input">Descripción</CustomFormLabel>
        <CustomTextField
          id="descripcion"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
        />
        <CustomFormLabel htmlFor="id_proyecto">Proyecto</CustomFormLabel>
        <CustomSelect
          id="id_proyecto"
          fullWidth
          variant="outlined"
        >

        </CustomSelect>
        <CustomFormLabel htmlFor="id_direccion">Direccíon</CustomFormLabel>
        <CustomSelect
          id="id_direccion"
          fullWidth
          variant="outlined"
        >

        </CustomSelect>
        <br /><br />
        <div>
          <Button color="primary" variant="contained">
            Guardar
          </Button>
        </div>
      </form>
    </ParentCard>
  );
};

export default ActividadesEditarForm;
