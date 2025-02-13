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
  const [conversionRate, setConversionRate] = useState(0.11);
  const [loading, setLoading] = useState(true);
  const [cooperantesOptions, setCooperantesOptions] = useState([]);
  const [lineasEstrategicasOptions, setLineasEstrategicasOptions] = useState([]);
  const [proyectoCooperante, setProyectoCooperante] = useState([]);
  const [proyectoLineas, setProyectoLineas] = useState([]);
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
    proyectoCooperantes: [
      {
        cooperante: {}
      }
    ],
    proyectoLineas: [
      {
        linea_Estrategica: {}
      }
    ],
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
  }, [id, conversionRate]);

  useEffect(() => {
    const fetchCooperantes = async () => {
      try {
        const response = await fetch(`${URL}cooperante`);
        if (response.ok) {
          const data = await response.json();
          setCooperantesOptions(data);
        } else {
          console.error('Error al obtener los cooperantes');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };
    const fetchLineas = async () => {
      try {
        const response = await fetch(`${URL}lineasEstrategicas`);
        if (response.ok) {
          const data = await response.json();
          setLineasEstrategicasOptions(data);
        } else {
          console.error('Error al obtener las lineas estrategicas ');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };
    fetchCooperantes();
    fetchLineas();
  }, []);

  useEffect(() => {
    const fetchProyectoLineas = async () => {
      try {
        const response = await fetch(`${URL}proyectoLinea/proyecto/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProyectoLineas(data);
          setProyecto((prevState) => ({
            ...prevState,
            lineas_estrategicas: data.map((linea) => linea.id_linea_estrategica), // Extrae solo los IDs
        }));
        } else {
          console.error('Error al obtener los rubros');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };
    const fetchProyectoCooperantes = async () => {
      try {
        const response = await fetch(`${URL}proyectoCooperantes/proyecto/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProyectoCooperante(data);
          setProyecto((prevState) => ({
            ...prevState,
            cooperantes: data.map((cooperante) => cooperante.id_cooperante), // Extrae solo los IDs
        }));
        } else {
          console.error('Error al obtener los rubros');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };
    fetchProyectoLineas();
    fetchProyectoCooperantes();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <ParentCard title="Ver proyecto">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CustomFormLabel htmlFor="nombre">Nombre del Proyecto</CustomFormLabel>
          <CustomTextField
            id="nombre"
            name="nombre"
            variant="outlined"
            fullWidth
            value={proyecto.nombre}
            disabled
          />
        </Grid>

        <Grid item xs={12}>
          <CustomFormLabel htmlFor="alias">Alias</CustomFormLabel>
          <CustomTextField
            id="alias"
            name="alias"
            variant="outlined"
            fullWidth
            value={proyecto.alias}
            disabled
          />
        </Grid>

        <Grid item xs={6}>
          <CustomFormLabel htmlFor="cooperantes">Cooperantes</CustomFormLabel>
          <FormControl fullWidth>
            <InputLabel id="cooperantes-label">Cooperantes</InputLabel>
            <Select
              labelId="cooperantes-label"
              id="cooperantes"
              name="cooperantes"
              multiple
              value={proyecto.cooperantes}
              disabled
              input={<OutlinedInput id="select-multiple-chip" label="Cooperantes" />}
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
          <CustomFormLabel htmlFor="lineas_estrategicas">Líneas estratégicas</CustomFormLabel>
          <FormControl fullWidth>
            <InputLabel id="lineas-estrategicas-label">Líneas estratégicas</InputLabel>
            <Select
              labelId="lineas-estrategicas-label"
              id="lineas_estrategicas"
              name="lineas_estrategicas"
              multiple
              value={proyecto.lineas_estrategicas}
              disabled
              input={<OutlinedInput id="select-multiple-chip" label="Líneas Estratégicas" />}
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

        <Grid item xs={12}>
          <CustomFormLabel htmlFor="descripcion">Descripción</CustomFormLabel>
          <CustomTextField
            id="descripcion"
            name="descripcion"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={proyecto.descripcion}
            disabled
          />
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomFormLabel htmlFor="fecha_inicio">Fecha de inicio</CustomFormLabel>
            <CustomTextField
              id="fecha_inicio"
              name="fecha_inicio"
              type="date"
              variant="outlined"
              fullWidth
              value={proyecto.fecha_inicio}
              disabled
            />
          </Grid>

          <Grid item xs={6}>
            <CustomFormLabel htmlFor="fecha_fin">Fecha de fin</CustomFormLabel>
            <CustomTextField
              id="fecha_fin"
              name="fecha_fin"
              type="date"
              variant="outlined"
              fullWidth
              value={proyecto.fecha_fin}
              disabled
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomFormLabel htmlFor="presupuesto_quetzales">Presupuesto en quetzales</CustomFormLabel>
            <CustomTextField
              id="presupuesto_quetzales"
              name="presupuesto_quetzales"
              type="number"
              fullWidth
              value={proyecto.presupuesto_quetzales}
              disabled
            />
          </Grid>

          <Grid item xs={6}>
            <CustomFormLabel htmlFor="presupuesto_euros">Presupuesto en euros</CustomFormLabel>
            <CustomTextField
              id="presupuesto_euros"
              name="presupuesto_euros"
              type="number"
              fullWidth
              value={proyecto.presupuesto_euros}
              disabled
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => navigate(-1)}
          >
            Regresar
          </Button>
        </Grid>
      </Grid>
    </ParentCard>
  );
};

export default VerProyecto;