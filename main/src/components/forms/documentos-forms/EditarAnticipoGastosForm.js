import {
    Alert,
    Button,
    Chip,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    OutlinedInput,
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
import { useNavigate } from 'react-router';

const EditarAnticipoGastosForm = ({ id }) => {

    const navigate = useNavigate();
    const [actividad, setActividad] = useState(
        {
            id_proyectos: 0,
            proyecto: {
                nombre: '',
            },
        }
    );
    const [elementos, setElementos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [elementosAnticipo, setElementosAnticipo] = useState([]);
    const [rubrosOptions, setRubrosOptions] = useState([]);
    const [proyectoRubros, setProyectoRubros] = useState([]);
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
        actividade: {},
        rubros: [],
        proyectoRubros: [
            {
                rubro: {}
            }
        ],
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

        const fetchRubros = async () => {
            try {
                const response = await fetch(`${URL}rubros`);
                if (response.ok) {
                    const data = await response.json();
                    setRubrosOptions(data);
                } else {
                    console.error('Error al obtener los rubros');
                }
            } catch (error) {
                console.error('Error al llamar a la API:', error);
            }
        };

        const fetchActividad = async () => {
            try {
                const response = await fetch(`${URL}actividades/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setActividad(data);
                } else {
                    console.error('Error al obtener la actividad');
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

        fetchRubros();
        fetchSubcategorias();
        fetchCategorias();
        fetchActividad();
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

        //Fetch rubros de a cuerdo con el proyecto seleccionado
        const fetchProyectoRubros = async () => {
            try {
                const response = await fetch(`${URL}proyectoRubros/proyecto/${anticipoGastos.contenido.id_proyectos}`);
                if (response.ok) {
                    const data = await response.json();
                    setProyectoRubros(data);
                    
                    // Sincronizar rubros seleccionados con los IDs de proyectoRubros
                    setAnticipoGastos((prevState) => ({
                        ...prevState,
                        rubros: data.map((rubro) => rubro.id_rubro), // Extrae solo los IDs
                    }));
                } else {
                    console.error('Error al obtener los rubros');
                }
            } catch (error) {
                console.error('Error al llamar a la API:', error);
            }
        };

        fetchElementosAnticipo();

        if (anticipoGastos.contenido.id_proyectos) {
            fetchProyectoRubros();
        }

    }, [anticipoGastos.id]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        setAnticipoGastos({
            ...anticipoGastos,
            [id]: value,
            contenido: {
                ...anticipoGastos.contenido,
                [id]: value,
            },
        });
    }

    const handleElementosAnticipoChange = (id, field, value) => {
        setElementosAnticipo((prevElementosAnticipo) =>
            prevElementosAnticipo.map((elemento) =>
                elemento.id_subcategoria === id
                    ? { ...elemento, [field]: value }
                    : elemento
            )
        );
    };

    const calculateTotal = () => {
        return elementosAnticipo.reduce((acc, item) => {
            const dias = item.dias || 0;
            const participantes = item.participantes || 0;
            const costoUnitario = item.costo_unitario || 0;
            return acc + dias * participantes * costoUnitario;
        }, 0);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {

            // Actualizar elementos de anticipo de gastos
            for (const elemento of elementosAnticipo) {
                const response = await fetch(`${URL}elementoAnticipos/${elemento.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(elemento),
                });

                if (response.ok) {
                    console.log('Elemento de anticipo de gastos actualizado correctamente');
                } else {
                    console.error('Error al actualizar el elemento de anticipo de gastos');
                }
            }

            const dataToSend = {
                contenido: {
                    fecha: anticipoGastos.contenido.fecha,
                    lugar: anticipoGastos.contenido.lugar,
                    total: calculateTotal(),
                    concepto: anticipoGastos.contenido.concepto,
                    cheque_a_favor: anticipoGastos.contenido.cheque_a_favor,
                    monto_solicitado: anticipoGastos.contenido.monto_solicitado,
                    id_proyectos: anticipoGastos.contenido.id_proyectos,
                    nombre_actividad: anticipoGastos.contenido.nombre_actividad,
                },
                nombre: anticipoGastos.nombre,
            };

            const response = await fetch(`${URL}documentos/${anticipoGastos.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                console.log('Anticipo de gastos actualizado correctamente');
                navigate(-1);
            } else {
                console.error('Error al actualizar el anticipo de gastos');
            }

            //Actualizar los rubros
            const rubrosPorEnviar = (anticipoGastos.rubros || []).map((idRubro) => ({
                id_rubro: Number(idRubro),
                id_proyecto: Number(anticipoGastos.contenido.id_proyectos),
            }));

            const responseRubros = await fetch(`${URL}proyectoRubros/proyecto/${anticipoGastos.actividade.id_proyectos}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rubrosPorEnviar),
            });

            if (responseRubros.ok) {
                <Alert variant="filled" severity="success">
                    Rubros guardados con éxito
                </Alert>
            } else {
                <Alert variant='filled' severity='error'>
                    Error al guardar los rubros
                </Alert>
            }

        } catch (error) {
            console.error('Error al llamar a la API:', error);
        }
    };

    return (
        <ParentCard title="Anticipo de Gastos">
            <form onSubmit={handleUpdate}>
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
                        />
                        <CustomFormLabel>Por concepto de:</CustomFormLabel>
                        <TextField
                            fullWidth
                            id="concepto"
                            name="concepto"
                            variant="outlined"
                            value={anticipoGastos.contenido.concepto}
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item lg={6} md={12}>
                        <CustomFormLabel htmlFor="rubros">Rubros</CustomFormLabel>
                        <FormControl fullWidth>
                            <InputLabel id="rubros-label">Seleccione los rubros</InputLabel>
                            <Select
                                labelId="rubros-label"
                                id="rubros"
                                name="rubros"
                                multiple
                                value={anticipoGastos.rubros || []}
                                onChange={(e) =>
                                    setAnticipoGastos({
                                        ...anticipoGastos,
                                        rubros: e.target.value, // Actualiza el estado con los rubros seleccionados
                                    })
                                }
                                input={<OutlinedInput id="select-multiple-chip" label="Seleccione los rubros" />}
                                renderValue={(selected) => (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {selected.map((rubroId) => {
                                            const rubro = rubrosOptions.find((r) => r.id === rubroId);
                                            return <Chip key={rubroId} label={rubro ? rubro.nombre_rubro : ''} />;
                                        })}
                                    </div>
                                )}
                            >
                                {rubrosOptions.map((rubro) => (
                                    <MenuItem key={rubro.id} value={rubro.id}>
                                        {rubro.nombre_rubro}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item lg={6} md={12}>
                        <CustomFormLabel>Proyecto:</CustomFormLabel>
                        <TextField
                            id="id_proyectos"
                            name="id_proyectos"
                            value={actividad.proyecto.nombre || "Error al cargar el proyecto"}
                            fullWidth
                            variant="outlined"
                            disabled
                        />
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
                                                    onChange={(e) =>
                                                        handleElementosAnticipoChange(
                                                            subcat.id,
                                                            'dias',
                                                            parseInt(e.target.value, 10) || 0
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    value={currentItem.participantes || 0}
                                                    style={{ width: '100%' }}
                                                    onChange={(e) =>
                                                        handleElementosAnticipoChange(
                                                            subcat.id,
                                                            'participantes',
                                                            parseInt(e.target.value, 10) || 0
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    value={currentItem.costo_unitario || 0}
                                                    style={{ width: '100%' }}
                                                    onChange={(e) =>
                                                        handleElementosAnticipoChange(
                                                            subcat.id,
                                                            'costo_unitario',
                                                            parseFloat(e.target.value) || 0
                                                        )
                                                    }
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
                    Gran total: Q{calculateTotal()}
                </Typography>
                <br />
                <Alert severity="warning">Al superar el monto de Q10,000.00 en anticipos de gastos, se necesitará autorización de Coordinación ejecutiva para realizar cheques</Alert>
                <br />
                <Button type="submit" variant="contained" color="primary">
                    Guardar
                </Button>
            </form>
        </ParentCard>
    )
}

export default EditarAnticipoGastosForm
