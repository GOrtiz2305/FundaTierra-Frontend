import {
    Alert,
    Button,
    Grid,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as yup from 'yup';
import { URL } from '../../../../config';
import ParentCard from '../../shared/ParentCard';
import CustomSelect from '../theme-elements/CustomSelect';

const AnticipoGastosForm = () => {

    const id = useParams();
    const navigate = useNavigate();
    const [proyectos, setProyectos] = useState([]);

    const CustomFormLabel = styled((props) => (
        <Typography variant="subtitle1" fontWeight={600} {...props} component="label" />
    ))(() => ({
        marginBottom: '5px',
        marginTop: '25px',
        display: 'block',
    }));

    const validationSchema = yup.object({
        actividad: yup.string().required('La actividad es obligatoria'),
        lugar: yup.string().required('El lugar es obligatorio'),
        fecha: yup.string().required('La fecha es obligatoria'),
        responsable: yup.string().required('El responsable es obligatorio'),
    });

    useEffect(() => {
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

        fetchProyectos();
        fetchDirecciones();
    }, []);

    return (
        <ParentCard title="Anticipo de Gastos">
            <form>
                <Grid container spacing={3} mb={3}>
                    <Grid item lg={6} md={12}>
                        <CustomFormLabel>Fecha:</CustomFormLabel>
                        <TextField
                            fullWidth
                            id="fecha"
                            name="fecha"
                            type="date"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item lg={6} md={12}>
                        <CustomFormLabel>Lugar:</CustomFormLabel>
                        <TextField
                            fullWidth
                            id="lugar"
                            name="lugar"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item lg={12} md={12}>
                        <CustomFormLabel>Nombre de la actividad:</CustomFormLabel>
                        <TextField
                            fullWidth
                            id="nombre_actividad"
                            name="nombre_actividad"
                            variant="outlined"
                        />
                        <CustomFormLabel>Por concepto de:</CustomFormLabel>
                        <TextField
                            fullWidth
                            id="concepto"
                            name="concepto"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item lg={6} md={12}>
                        <CustomFormLabel>Cheque a favor de:</CustomFormLabel>
                        <TextField
                            fullWidth
                            id="cheque_a_favor"
                            name="cheque_a_favor"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item lg={6} md={12}>
                        <CustomFormLabel>Monto solicitado:</CustomFormLabel>
                        <TextField
                            fullWidth
                            id="monto_solicitado"
                            name="monto_solicitado"
                            type="number"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item lg={6} md={12}>
                        <CustomFormLabel>Rubro:</CustomFormLabel>
                        <Select fullWidth>
                            <option value="1">1</option>
                            <option value="2">2</option>
                        </Select>
                    </Grid>
                    <Grid item lg={6} md={12}>
                        <CustomFormLabel>Proyecto:</CustomFormLabel>
                        <CustomSelect
                            id="id_proyectos"
                            name="id_proyectos"
                            // value={formik.values.id_proyectos}
                            // onChange={formik.handleChange}
                            fullWidth
                            variant="outlined"
                        >
                            {proyectos.map((proyecto) => (
                                <MenuItem key={proyecto.id} value={proyecto.id}>
                                    {proyecto.nombre}
                                </MenuItem>
                            ))}
                        </CustomSelect>
                        {/* {formik.errors.id_proyectos && (
                            <FormHelperText error>
                                {formik.errors.id_proyectos}
                            </FormHelperText>
                        )} */}
                    </Grid>
                </Grid>
            </form>
        </ParentCard>
    )
}

export default AnticipoGastosForm
