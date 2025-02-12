import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TextField,
    CircularProgress
} from '@mui/material';
import { Stack } from '@mui/system';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable
} from '@tanstack/react-table';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import axios from 'axios';
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconRefresh } from '@tabler/icons';
import { URL } from "../../../../../config";

const columnHelper = createColumnHelper();

const UsuariosPaginationTable = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMunicipios = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${URL}usuarios/desactivados`);
                setData(response.data);
                setFilteredData(response.data);
            } catch (error) {
                console.error("Error al obtener Usuarios:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMunicipios();
    }, []);

    const handleActivate = async (id) => {
        setLoading(true);
        try {
            await axios.put(`${URL}usuarios/activar/${id}`);
            setData((prevData) => prevData.map((item) =>
                item.id === id ? { ...item, estado: true } : item
            ));
        } catch (error) {
            console.error("Error al activar Usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setFilteredData(
            data.filter((usuario) =>
                !usuario.estado && usuario.username.toLowerCase().includes(searchQuery.toLowerCase())
                || usuario.persona.nombre.toLowerCase().includes(searchQuery.toLowerCase())
                || usuario.persona.apellido.toLowerCase().includes(searchQuery.toLowerCase())
                || usuario.role.nombre.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, data]);

    const columns = [
        columnHelper.accessor('username', {
            header: 'Nombre Usuario',
            cell: (info) => (
                <Typography variant="subtitle1" color="textSecondary">
                    {info.getValue()}
                </Typography>
            ),
        }),
        columnHelper.accessor('persona.nombre', {
            header: () => 'Colaborador',
            cell: (info) => {
                const nombre = info.row.original.persona.nombre; // Obtener el nombre
                const apellido = info.row.original.persona.apellido; // Obtener el apellido
                return (
                    <Typography variant="subtitle1" color="textSecondary">
                        {`${nombre} ${apellido}`} {/* Concatenar nombre y apellido */}
                    </Typography>
                );
            },
        }),
        columnHelper.accessor('role.nombre', {
            header: 'Rol',
            cell: (info) => (
                <Typography variant="subtitle1" color="textSecondary">
                    {info.getValue()}
                </Typography>
            ),
        }),
        columnHelper.accessor('estado', {
            header: 'Estado',
            cell: (info) => (
                <Chip
                    sx={{
                        bgcolor: info.getValue() ? 'success.light' : 'error.light',
                        color: info.getValue() ? 'success.main' : 'error.main',
                        borderRadius: '8px',
                    }}
                    label={info.getValue() ? 'Activo' : 'Inactivo'}
                />
            ),
        }),
        {
            id: 'acciones',
            header: 'Acciones',
            cell: ({ row }) => (
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleActivate(row.original.id)}
                        startIcon={<IconRefresh width={18} />}
                    >
                        Activar
                    </Button>
                </Stack>
            ),
        },
    ];

    const table = useReactTable({
        data: filteredData,
        columns,
        state: { columnFilters },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        label="Buscar Usuarios"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TableContainer>
                        {loading ? (
                            <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
                        ) : (
                            <Table sx={{ whiteSpace: 'nowrap' }}>
                                <TableHead>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableCell key={header.id}>
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHead>
                                <TableBody>
                                    {table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between" alignItems="center" p={3}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography>
                                Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                            </Typography>
                            <TextField
                                type="number"
                                min="1"
                                max={table.getPageCount()}
                                defaultValue={table.getState().pagination.pageIndex + 1}
                                onChange={(e) => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                    table.setPageIndex(page);
                                }}
                                sx={{ width: 60 }}
                            />
                            <CustomSelect
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => table.setPageSize(Number(e.target.value))}
                            >
                                {[10, 20, 30].map((pageSize) => (
                                    <MenuItem key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </MenuItem>
                                ))}
                            </CustomSelect>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <IconButton
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <IconChevronsLeft />
                            </IconButton>
                            <IconButton
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <IconChevronLeft />
                            </IconButton>
                            <IconButton
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <IconChevronRight />
                            </IconButton>
                            <IconButton
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <IconChevronsRight />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UsuariosPaginationTable;
