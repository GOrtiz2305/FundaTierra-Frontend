import {
    Button,
} from '@mui/material';
import React, { useState } from 'react';
import ParentCard from '../../shared/ParentCard';
import CustomFormLabel from '../theme-elements/CustomFormLabel';
import CustomTextField from '../theme-elements/CustomTextField';
    
    const ProyectosEditarForm = () => {
      const [state, setState] = useState({
        checkedB: false,
      });
    
      const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
      };
    
      const [value, setValue] = useState(null);
      const [presupuesto, setPresupuesto] = useState("");
    
      // Maneja el cambio en el campo de presupuesto
      const handlePresupuestoChange = (e) => {
        const valor = e.target.value;
        const regex = /^Q?\s?(\d+(\.\d{0,2})?)?$/;
    
        if (regex.test(valor)) {
          setPresupuesto(valor.startsWith("Q") ? valor : `Q ${valor}`);
        }
      };
    
      return (
        <ParentCard title='Editar  proyectos - Información general'>
          <form>
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
              Presupuesto
            </CustomFormLabel>
            <CustomTextField
              id="presupuesto"
              variant="outlined"
              fullWidth
              value={presupuesto}
              onChange={handlePresupuestoChange}
            />
    
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
    
    export default ProyectosEditarForm;
      