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
    const [elementos, setElementos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);

    const CustomFormLabel = styled((props) => (
        <Typography variant="subtitle1" fontWeight={600} {...props} component="label" />
    ))(() => ({
        marginBottom: '5px',
        marginTop: '25px',
        display: 'block',
    }));

    const validationSchema = yup.object({
        fecha: yup.string().required('La fecha es obligatoria'),
        lugar: yup.string().required('El lugar es obligatorio'),
        nombre_actividad: yup.string().required('El nombre de la actividad es obligatorio'),
        concepto: yup.string().required('El concepto es obligatorio'),
        cheque_a_favor: yup.string().required('El cheque a favor es obligatorio'),
        monto_solicitado: yup
            .number()
            .typeError('El monto debe ser un número')
            .required('El monto solicitado es obligatorio'),
        id_proyectos: yup
            .number()
            .typeError('Debes seleccionar un proyecto')
            .required('El proyecto es obligatorio'),
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
    }, []);

    const handleItemChange = (id, key, value) => {
        setElementos((prevElementos) =>
            prevElementos.map((item) =>
                item.id === id ? { ...item, [key]: value } : item
            )
        );
    };

    const calculateTotal = () => {
        return elementos.reduce(
            (acc, item) =>
                acc + (item.dias || 0) * (item.participantes || 0) * (item.costoUnitario || 0),
            0
        );
    }

    const handleSave = async (values) => {
        try {
            //Esto es lo que se guardara en contenido como un objeto
            const dataEncapsulada = {
                fecha: values.fecha,
                lugar: values.lugar,
                nombre_actividad: values.nombre_actividad,
                concepto: values.concepto,
                cheque_a_favor: values.cheque_a_favor,
                monto_solicitado: Number(values.monto_solicitado),
                id_proyectos: Number(values.id_proyectos),
                total: Number(calculateTotal()),
            };

            //Esto es lo que se guardara en la tabla documentos
            const dataNoEncapsulada = {
                nombre: "Anticipo de gastos",
                id_tipo: 5,
                id_estado: 1,
                id_actividad: Number(id.id),
            };

            //Esto es lo que se enviara a la API
            const dataToSend = {
                contenido: {
                    ...dataEncapsulada,
                },
                ...dataNoEncapsulada,
            };

            // Se guarda el documento principal
            const response = await fetch(`${URL}documentos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                <Alert variant="filled" severity="success">
                    Anticipo de gastos creado con éxito
                </Alert>
            } else {
                <Alert variant='filled' severity='error'>
                    Error al crear el anticipo de gastos
                </Alert>
            }

            const documentoData = await response.json();
            const idDocumento = documentoData.id; // Se obtiene el id del documento creado

            // Se guardan los elementos
            const elementosToSend = elementos.map((elemento) => ({
                dias: Number(elemento.dias),
                participantes: Number(elemento.participantes),
                costo_unitario: Number(elemento.costoUnitario),
                total: (elemento.dias || 0) * (elemento.participantes || 0) * (elemento.costoUnitario || 0),
                id_documento: Number(idDocumento),
                id_subcategoria: Number(elemento.id),
            }));

            const responseElementos = await fetch(`${URL}elementoAnticipos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(elementosToSend),
            });

            if (responseElementos.ok) {
                <Alert variant="filled" severity="success">
                    Elementos guardados con éxito
                </Alert>
            } else {
                <Alert variant='filled' severity='error'>
                    Error al guardar los elementos
                </Alert>
            }

            //Ir a la pagina anterior
            navigate(-1);
        } catch (error) {
            console.error('Error al llamar a la API:', error);
            alert('Error al llamar a la API');
        }
    };

    const formik = useFormik({
        initialValues: {
            fecha: '',
            lugar: '',
            nombre_actividad: '',
            concepto: '',
            cheque_a_favor: '',
            monto_solicitado: '',
            id_proyectos: 0,
            total: 0,
        },
        validationSchema,
        onSubmit: async (values) => {
            handleSave(values);
        },
    });

    return (
        <ParentCard title="Anticipo de Gastos">
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3} mb={3}>
                    <Grid item lg={6} md={12}>
                        <CustomFormLabel>Fecha:</CustomFormLabel>
                        <TextField
                            fullWidth
                            id="fecha"
                            name="fecha"
                            type="date"
                            variant="outlined"
                            onChange={formik.handleChange}
                            value={formik.values.fecha}
                            error={formik.touched.fecha && Boolean(formik.errors.fecha)}
                            helperText={formik.touched.fecha && formik.errors.fecha}
                        />
                    </Grid>
                    <Grid item lg={6} md={12}>
                        <CustomFormLabel>Lugar:</CustomFormLabel>
                        <TextField
                            fullWidth
                            id="lugar"
                            name="lugar"
                            variant="outlined"
                            onChange={formik.handleChange}
                            value={formik.values.lugar}
                            error={formik.touched.lugar && Boolean(formik.errors.lugar)}
                            helperText={formik.touched.lugar && formik.errors.lugar}
                        />
                    </Grid>
                    <Grid item lg={12} md={12}>
                        <CustomFormLabel>Nombre de la actividad:</CustomFormLabel>
                        <TextField
                            fullWidth
                            id="nombre_actividad"
                            name="nombre_actividad"
                            variant="outlined"
                            onChange={formik.handleChange}
                            value={formik.values.nombre_actividad}
                            error={formik.touched.nombre_actividad && Boolean(formik.errors.nombre_actividad)}
                            helperText={formik.touched.nombre_actividad && formik.errors.nombre_actividad}
                        />
                        <CustomFormLabel>Por concepto de:</CustomFormLabel>
                        <TextField
                            fullWidth
                            id="concepto"
                            name="concepto"
                            variant="outlined"
                            onChange={formik.handleChange}
                            value={formik.values.concepto}
                            error={formik.touched.concepto && Boolean(formik.errors.concepto)}
                            helperText={formik.touched.concepto && formik.errors.concepto}
                        />
                    </Grid>
                    <Grid item lg={6} md={12}>
                        <CustomFormLabel>Cheque a favor de:</CustomFormLabel>
                        <TextField
                            fullWidth
                            id="cheque_a_favor"
                            name="cheque_a_favor"
                            variant="outlined"
                            onChange={formik.handleChange}
                            value={formik.values.cheque_a_favor}
                            error={formik.touched.cheque_a_favor && Boolean(formik.errors.cheque_a_favor)}
                            helperText={formik.touched.cheque_a_favor && formik.errors.cheque_a_favor}
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
                            onChange={formik.handleChange}
                            value={formik.values.monto_solicitado}
                            error={formik.touched.monto_solicitado && Boolean(formik.errors.monto_solicitado)}
                            helperText={formik.touched.monto_solicitado && formik.errors.monto_solicitado}
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
                            value={formik.values.id_proyectos}
                            onChange={(e) => formik.setFieldValue("id_proyectos", e.target.value)}
                            onBlur={formik.handleBlur}
                            error={formik.touched.id_proyectos && Boolean(formik.errors.id_proyectos)}
                            helperText={formik.touched.id_proyectos && formik.errors.id_proyectos}
                            fullWidth
                            variant="outlined"
                        >
                            {proyectos.map((proyecto) => (
                                <MenuItem key={proyecto.id} value={proyecto.id}>
                                    {proyecto.nombre}
                                </MenuItem>
                            ))}
                        </CustomSelect>
                        {formik.errors.id_proyectos && (
                            <FormHelperText error>
                                {formik.errors.id_proyectos}
                            </FormHelperText>
                        )}
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
                                    const currentItem = elementos.find((item) => item.id === subcat.id) || {};
                                    return (
                                        <TableRow key={subcat.id}>
                                            {/* <TableCell>{subcat.id_categoria}</TableCell> */}
                                            <TableCell>{subcat.nombre}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    value={currentItem.dias || 0}
                                                    style={{ width: '100%' }}
                                                    onChange={(e) => handleItemChange(subcat.id, 'dias', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    value={currentItem.participantes || 0}
                                                    style={{ width: '100%' }}
                                                    onChange={(e) => handleItemChange(subcat.id, 'participantes', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    value={currentItem.costoUnitario || 0}
                                                    style={{ width: '100%' }}
                                                    onChange={(e) => handleItemChange(subcat.id, 'costoUnitario', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                Q{(currentItem.dias || 0) * (currentItem.participantes || 0) * (currentItem.costoUnitario || 0)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                        )}
                    </TableBody>
                </Table>
                <Typography variant="h6" mt={3}>
                    Subtotal alimentos: Q{elementos
                        .filter((item) => item.id_categoria === 1) // Filtrar elementos de la categoría 1
                        .reduce(
                            (acc, item) =>
                                acc +
                                (item.dias || 0) * (item.participantes || 0) * (item.costoUnitario || 0),
                            0
                        )}
                </Typography>

                <Typography variant="h6" mt={3}>
                    Gran total: Q{calculateTotal()}
                </Typography>
                <br />
                <Alert severity="warning">Al superar el monto de Q10,000.00 en anticipos de gastos, se necesitará autorización de Coordinación ejecutiva para realizar cheques</Alert>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '20px' }}
                    disabled={!formik.isValid || formik.isSubmitting}
                >
                    Guardar Agenda
                </Button>
            </form>
            <br />
        </ParentCard>
    )
}

export default AnticipoGastosForm
