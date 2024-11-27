import {
  Button,
} from '@mui/material';
import React from 'react';
import ParentCard from '../../shared/ParentCard';
import CustomFormLabel from '../theme-elements/CustomFormLabel';
import CustomTextField from '../theme-elements/CustomTextField';

const ProyectosOrdinaryForm = () => {
  const [state, setState] = React.useState({
    checkedB: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const [value, setValue] = React.useState(null);

  return (
    <ParentCard title='Formulario de Actividades Hola mundo asndlasn- Información general'>
      <form>
        <CustomFormLabel htmlFor="fecha_inicio">Fecha</CustomFormLabel>
        <CustomTextField type="date" id="fecha_inicio" fullWidth />
        <CustomFormLabel
          sx={{
            mt: 0,
          }}
          htmlFor="nombre"
        >
          Nombre del Proyecto
        </CustomFormLabel>
        <CustomTextField
          id="nombre"
          variant="outlined"
          fullWidth
        />
        <CustomFormLabel htmlFor="fecha_inicio">Fecha Inicio</CustomFormLabel>
        <CustomTextField type="date" id="fecha_inicio" fullWidth />
        <CustomFormLabel htmlFor="fecha_fin">Fecha final</CustomFormLabel>
        <CustomTextField type="date" id="fecha_fin" fullWidth />

        <CustomFormLabel htmlFor="ordinary-outlined-password-input">Descripción</CustomFormLabel>
        <CustomTextField
          id="descripcion"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
        />
        <CustomFormLabel
          sx={{
            mt: 0,
          }}
          htmlFor="presupuesto"
        >

        </CustomFormLabel>
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

export default ProyectosOrdinaryForm;
  