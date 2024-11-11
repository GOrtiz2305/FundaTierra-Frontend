import React from 'react';
import {
  Button,
} from '@mui/material';
import CustomTextField from '../theme-elements/CustomTextField';
import CustomFormLabel from '../theme-elements/CustomFormLabel';
import ParentCard from '../../shared/ParentCard';
import CustomSelect from '../theme-elements/CustomSelect';

const ActividadesOrdinaryForm = () => {
  const [state, setState] = React.useState({
    checkedB: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const [value, setValue] = React.useState(null);

  return (
    <ParentCard title='Formulario de Actividades - Información general'>
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

export default ActividadesOrdinaryForm;
