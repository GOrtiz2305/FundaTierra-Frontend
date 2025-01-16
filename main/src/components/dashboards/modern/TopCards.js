import React, { useEffect, useState } from 'react';
import { Box, CardContent, Grid, Typography } from '@mui/material';

import icon1 from '../../../assets/images/svgs/done.svg';
import icon2 from '../../../assets/images/svgs/workingOn.svg';
import { URL } from '../../../../config';
import axios from 'axios';

const TopCards = () => {
  const [proyectos, setProyectos] = useState({});
  const [actividades, setActividades] = useState({});

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await axios.get(`${URL}api/conteoProyectos/`);
        setProyectos(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    const fetchActividades = async () => {
      try {
        const response = await axios.get(`${URL}api/conteoActividades/`);
        setActividades(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProyectos();
    fetchActividades();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4} lg={3}>
        <Box bgcolor={'success' + '.light'} textAlign="center">
          <CardContent>
            <img src={icon2} alt={icon2} width="50" />
            <Typography
              color={'success' + '.main'}
              mt={1}
              variant="subtitle1"
              fontWeight={600}
            >
              Proyectos Activos
            </Typography>
            <Typography color={'success' + '.main'} variant="h4" fontWeight={600}>
              {proyectos.enProgreso || 0}
            </Typography>
          </CardContent>
        </Box>
      </Grid>
      <Grid item xs={12} sm={4} lg={3}>
        <Box bgcolor={'error' + '.light'} textAlign="center">
          <CardContent>
            <img src={icon1} alt={icon1} width="50" />
            <Typography
              color={'error' + '.main'}
              mt={1}
              variant="subtitle1"
              fontWeight={600}
            >
              Proyectos Finalizados
            </Typography>
            <Typography color={'error' + '.main'} variant="h4" fontWeight={600}>
              {proyectos.finalizado || 0}
            </Typography>
          </CardContent>
        </Box>
      </Grid>
      <Grid item xs={12} sm={4} lg={3}>
        <Box bgcolor={'success' + '.light'} textAlign="center">
          <CardContent>
            <img src={icon2} alt={icon2} width="50" />
            <Typography
              color={'success' + '.main'}
              mt={1}
              variant="subtitle1"
              fontWeight={600}
            >
              Actividades Activas
            </Typography>
            <Typography color={'success' + '.main'} variant="h4" fontWeight={600}>
              {actividades.enProgreso + actividades.pendiente || 0}
            </Typography>
          </CardContent>
        </Box>
      </Grid>
      <Grid item xs={12} sm={4} lg={3}>
        <Box bgcolor={'error' + '.light'} textAlign="center">
          <CardContent>
            <img src={icon1} alt={icon1} width="50" />
            <Typography
              color={'error' + '.main'}
              mt={1}
              variant="subtitle1"
              fontWeight={600}
            >
              Actividades Finalizadas
            </Typography>
            <Typography color={'error' + '.main'} variant="h4" fontWeight={600}>
              {actividades.completado || 0}
            </Typography>
          </CardContent>
        </Box>
      </Grid>
    </Grid>
  );
};

export default TopCards;
