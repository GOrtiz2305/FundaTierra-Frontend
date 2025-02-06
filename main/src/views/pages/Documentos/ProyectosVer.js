import {
    Button,
    Chip,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { URL } from '../../../../config';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import ParentCard from '../../../components/shared/ParentCard';
  
  const VerProyecto = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [conversionRate] = useState(0.11);
    const [loading, setLoading] = useState(true);
    const [cooperantesOptions, setCooperantesOptions] = useState([]);
    const [lineasEstrategicasOptions, setLineasEstrategicasOptions] = useState([]);
  
    const [proyecto, setProyecto] = useState({
      nombre: '',
      alias: '',
      cooperantes: [],
      lineas_estrategicas: [],
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: '',
      presupuesto_quetzales: '',
      presupuesto_euros: '',
    });
  
    useEffect(() => {
      const fetchProyecto = async () => {
        try {
          const response = await axios.get(`${URL}proyectos/${id}`);
          const proyectoData = response.data;
          setProyecto({
            ...proyectoData,
            cooperantes: Array.isArray(proyectoData.cooperantes) ? proyectoData.cooperantes : [],
            lineas_estrategicas: Array.isArray(proyectoData.lineas_estrategicas) ? proyectoData.lineas_estrategicas : [],
          });
          setLoading(false);
        } catch (error) {
          console.error('Error al obtener el proyecto:', error);
          setLoading(false);
        }
      };
      fetchProyecto();
    }, [id]);
  
    useEffect(() => {
      const fetchOptions = async () => {
        try {
          const cooperantesResponse = await axios.get(`${URL}cooperante`);
          const lineasEstrategicasResponse = await axios.get(`${URL}lineasEstrategicas`);
  
          setCooperantesOptions(cooperantesResponse.data);
          setLineasEstrategicasOptions(lineasEstrategicasResponse.data);
        } catch (error) {
          console.error('Error al obtener las opciones de cooperantes y líneas estratégicas:', error);
        }
      };
      fetchOptions();
    }, []);
  
    if (loading) return <div>Cargando...</div>;
  
    return (
      <ParentCard title="Ver Proyecto - Detalles">
        <form>
          <CustomFormLabel htmlFor="nombre">Nombre del Proyecto</CustomFormLabel>
          <CustomTextField
            id="nombre"
            name="nombre"
            variant="outlined"
            fullWidth
            value={proyecto.nombre}
            InputProps={{ readOnly: true }}
          />
  
          <CustomFormLabel htmlFor="alias">Alias</CustomFormLabel>
          <CustomTextField
            id="alias"
            name="alias"
            variant="outlined"
            fullWidth
            value={proyecto.alias}
            InputProps={{ readOnly: true }}
          />
  
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <CustomFormLabel htmlFor="cooperantes">Cooperantes</CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="cooperantes-label">Seleccione los cooperantes</InputLabel>
                <Select
                  labelId="cooperantes-label"
                  id="cooperantes"
                  name="cooperantes"
                  multiple
                  value={proyecto.cooperantes}
                  disabled
                  input={<OutlinedInput id="select-multiple-chip" label="Seleccione los cooperantes" />}
                  renderValue={(selected) => (
                    <div>
                      {selected.map((value) => {
                        const cooperante = cooperantesOptions.find(coop => coop.id === value);
                        return cooperante ? <Chip key={value} label={cooperante.nombre_donante} /> : null;
                      })}
                    </div>
                  )}
                >
                  {cooperantesOptions.map((cooperante) => (
                    <MenuItem key={cooperante.id} value={cooperante.id}>
                      {cooperante.nombre_donante}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
  
            <Grid item xs={6}>
              <CustomFormLabel htmlFor="lineas_estrategicas">Líneas Estratégicas</CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="lineas-estrategicas-label">Seleccione las líneas estratégicas</InputLabel>
                <Select
                  labelId="lineas-estrategicas-label"
                  id="lineas_estrategicas"
                  name="lineas_estrategicas"
                  multiple
                  value={proyecto.lineas_estrategicas}
                  disabled
                  input={<OutlinedInput id="select-multiple-chip" label="Seleccione las líneas estratégicas" />}
                  renderValue={(selected) => (
                    <div>
                      {selected.map((value) => {
                        const linea = lineasEstrategicasOptions.find(linea => linea.id === value);
                        return linea ? <Chip key={value} label={linea.nombre} /> : null;
                      })}
                    </div>
                  )}
                >
                  {lineasEstrategicasOptions.map((linea) => (
                    <MenuItem key={linea.id} value={linea.id}>
                      {linea.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
  
          <CustomFormLabel htmlFor="descripcion">Descripción</CustomFormLabel>
          <CustomTextField
            id="descripcion"
            name="descripcion"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={proyecto.descripcion}
            InputProps={{ readOnly: true }}
          />
  
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <CustomFormLabel htmlFor="fecha_inicio">Fecha de Inicio</CustomFormLabel>
              <CustomTextField
                id="fecha_inicio"
                name="fecha_inicio"
                type="date"
                variant="outlined"
                fullWidth
                value={proyecto.fecha_inicio}
                InputProps={{ readOnly: true }}
              />
            </Grid>
  
            <Grid item xs={6}>
              <CustomFormLabel htmlFor="fecha_fin">Fecha de Fin</CustomFormLabel>
              <CustomTextField
                id="fecha_fin"
                name="fecha_fin"
                type="date"
                variant="outlined"
                fullWidth
                value={proyecto.fecha_fin}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
  
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <CustomFormLabel htmlFor="presupuesto_quetzales">Presupuesto en Quetzales</CustomFormLabel>
              <CustomTextField
                id="presupuesto_quetzales"
                name="presupuesto_quetzales"
                type="number"
                fullWidth
                value={proyecto.presupuesto_quetzales}
                InputProps={{ readOnly: true }}
              />
            </Grid>
  
            <Grid item xs={6}>
              <CustomFormLabel htmlFor="presupuesto_euros">Presupuesto en Euros</CustomFormLabel>
              <CustomTextField
                id="presupuesto_euros"
                name="presupuesto_euros"
                type="number"
                fullWidth
                value={proyecto.presupuesto_euros}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
  
          {/* Botón para regresar */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate(-1)} // Regresa a la pantalla anterior
            sx={{ marginTop: 2 }}
          >
            Regresar
          </Button>
        </form>
      </ParentCard>
    );
  };
  
  export default VerProyecto;
  