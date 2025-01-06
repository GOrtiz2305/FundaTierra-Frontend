import {
    Alert,
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
import React, { useEffect, useState } from 'react';
import { URL } from '../../../../config';
import ParentCard from '../../shared/ParentCard';
import CustomSelect from '../theme-elements/CustomSelect';

const VerAnticipoGastosForm = ({ id }) => {

    const [proyectos, setProyectos] = useState([]);
    const [elementos, setElementos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [elementosAnticipo, setElementosAnticipo] = useState([]);

    const [anticipoGastos, setAnticipoGastos] = useState({
        id: 0,
        fecha: '',
        lugar: '',
        total: 0,
        concepto: '',
        cheque_a_favor: '',
        monto_solicitado: 0,
        id_proyectos: 0,
        nombre_actividad: '',
        contenido: {},
    });

    const CustomFormLabel = styled((props) => (
        <Typography variant="subtitle1" fontWeight={600} {...props} component="label" />
    ))(() => ({
        marginBottom: '5px',
        marginTop: '25px',
        display: 'block',
    }));

    useEffect(() => {
        const fetchAnticipoGastos = async () => {
            try {
                const response = await fetch(`${URL}api/documentos/${id}/5`);
                if (response.ok) {
                    const data = await response.json();
                    setAnticipoGastos(data);
                } else {
                    console.error('Error al obtener el anticipo de gastos');
                }
            } catch (error) {
                console.error('Error al llamar a la API:', error);
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

        const fetchCategorias = async () => {
            try {
                const response = await fetch(`${URL}categorias`);
                if (response.ok) {
                    const data = await response.json();
                    setCategorias(data);
                } else {
                    console.error('Error al obtener las categorías');
                }
            } catch (error) {
                console.error('Error al llamar a la API:', error);
            }
        };

        const fetchSubcategorias = async () => {
            try {
                const response = await fetch(`${URL}subcategorias`);
                if (response.ok) {
                    const data = await response.json();
                    setSubcategorias(data);

                    // Inicializar `elementos` sólo si está vacío.
                    setElementos((prevElementos) =>
                        prevElementos.length === 0
                            ? data.map((subcat) => ({
                                id: subcat.id,
                                dias: '',
                                participantes: '',
                                costoUnitario: '',
                            }))
                            : prevElementos
                    );
                } else {
                    console.error('Error al obtener las subcategorías');
                }
            } catch (error) {
                console.error('Error al llamar a la API:', error);
            }
        };

        fetchSubcategorias();
        fetchCategorias();
        fetchProyectos();
        fetchAnticipoGastos();
    }, []);

    // Se ejecuta en un efecto separado porque depende del id del anticipo de gastos 
    useEffect(() => {
        const fetchElementosAnticipo = async () => {
            try {
                const response = await fetch(`${URL}elementoAnticipos/documento/${anticipoGastos.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setElementosAnticipo(data);
                } else {
                    console.error('Error al obtener los elementos de anticipo de gastos');
                }
            } catch (error) {
                console.error('Error al llamar a la API:', error);
            }
        };

        fetchElementosAnticipo();
    }, [anticipoGastos.id]);

    return (
        <ParentCard title="Anticipo de Gastos">
            <Grid container spacing={3} mb={3}>
                <Grid item lg={6} md={12}>
                    <CustomFormLabel>Fecha:</CustomFormLabel>
                    <TextField
                        fullWidth
                        id="fecha"
                        name="fecha"
                        type="date"
                        variant="outlined"
                        value={anticipoGastos.contenido.fecha}
                    />
                </Grid>
                <Grid item lg={6} md={12}>
                    <CustomFormLabel>Lugar:</CustomFormLabel>
                    <TextField
                        fullWidth
                        id="lugar"
                        name="lugar"
                        variant="outlined"
                        value={anticipoGastos.contenido.lugar}
                    />
                </Grid>
                <Grid item lg={12} md={12}>
                    <CustomFormLabel>Nombre de la actividad:</CustomFormLabel>
                    <TextField
                        fullWidth
                        id="nombre_actividad"
                        name="nombre_actividad"
                        variant="outlined"
                        value={anticipoGastos.contenido.nombre_actividad}
                    />
                    <CustomFormLabel>Por concepto de:</CustomFormLabel>
                    <TextField
                        fullWidth
                        id="concepto"
                        name="concepto"
                        variant="outlined"
                        value={anticipoGastos.contenido.concepto}
                    />
                </Grid>
                <Grid item lg={6} md={12}>
                    <CustomFormLabel>Cheque a favor de:</CustomFormLabel>
                    <TextField
                        fullWidth
                        id="cheque_a_favor"
                        name="cheque_a_favor"
                        variant="outlined"
                        value={anticipoGastos.contenido.cheque_a_favor}
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
                        value={anticipoGastos.contenido.monto_solicitado}
                    />
                </Grid>
                <Grid item lg={6} md={12}>
                    <CustomFormLabel>Rubro:</CustomFormLabel>
                    <Select fullWidth disabled>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </Select>
                </Grid>
                <Grid item lg={6} md={12}>
                    <CustomFormLabel>Proyecto:</CustomFormLabel>
                    <CustomSelect
                        id="id_proyectos"
                        name="id_proyectos"
                        fullWidth
                        variant="outlined"
                        value={anticipoGastos?.contenido?.id_proyectos || ""}
                        disabled
                    >
                        {proyectos.map((proyecto) => (
                            <MenuItem key={proyecto.id} value={proyecto.id}>
                                {proyecto.nombre}
                            </MenuItem>
                        ))}
                    </CustomSelect>
                </Grid>
            </Grid>

            <Alert severity="success">Elementos</Alert>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>Descripción</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Días</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Participantes</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Costo unitario</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {categorias.map((categoria) =>
                        subcategorias
                            .filter((subcat) => subcat.id_categoria === categoria.id)
                            .map((subcat) => {
                                const currentItem = elementosAnticipo.find(
                                    (item) => item.id_subcategoria === subcat.id
                                ) || { dias: 0, participantes: 0, costo_unitario: 0 }; // Valores predeterminados si no se encuentra

                                return (
                                    <TableRow key={subcat.id}>
                                        <TableCell>{subcat.nombre}</TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={currentItem.dias || 0}
                                                style={{ width: '100%' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={currentItem.participantes || 0}
                                                style={{ width: '100%' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={currentItem.costo_unitario || 0}
                                                style={{ width: '100%' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            Q{(currentItem.dias || 0) * (currentItem.participantes || 0) * (currentItem.costo_unitario || 0)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                    )}
                </TableBody>
            </Table>
            {/* <Typography variant="h6" mt={3}>
                Subtotal alimentos: Q
            </Typography> */}

            <Typography variant="h6" mt={3}>
                Gran total: Q{anticipoGastos.contenido.total}
            </Typography>
            <br />
            <Alert severity="warning">Al superar el monto de Q10,000.00 en anticipos de gastos, se necesitará autorización de Coordinación ejecutiva para realizar cheques</Alert>
            <br />
        </ParentCard>
    )
}

export default VerAnticipoGastosForm
