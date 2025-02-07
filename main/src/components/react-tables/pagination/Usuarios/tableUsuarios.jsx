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
} from '@mui/material';
import { Stack } from '@mui/system';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconPencil, IconTrash } from '@tabler/icons';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { URL } from '../../../../../config';
import DownloadCard from 'src/components/shared/DownloadCard';
import CustomTextField from '../../../forms/theme-elements/CustomTextField';
import CustomSelect from '../../../forms/theme-elements/CustomSelect';

const columnHelper = createColumnHelper();

const UsuariosPaginationTable = () => {
    const [data, setData] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get(`${URL}usuarios`);
                setData(response.data);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
            }
        };
        fetchUsuarios();
    }, []);

    const handleEdit = (id) => {
        navigate(`/usuarios/editar/${id}`);
    };

    const handleDelete = async (usuario) => {
        try {
            await axios.put(`${URL}usuarios/eliminar/${usuario.id}`);
            setData((prevData) => prevData.filter((item) => item.id !== usuario.id));
        } catch (error) {
            console.error("Error al eliminar Usuario:", error);
        }
    };

    const columns = [
        columnHelper.accessor('username', {
            header: () => 'Nombre de Usuario',
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
            header: () => 'Rol',
            cell: (info) => (
                <Typography variant="subtitle1" color="textSecondary">
                    {info.getValue()}
                </Typography>
            ),
        }),
        columnHelper.accessor('estado', {
            header: () => 'Estado',
            cell: (info) => (
                <Chip
                    label={info.getValue() ? 'Activo' : 'Inactivo'}
                    sx={{
                        bgcolor: info.getValue() ? 'success.light' : 'error.light',
                        color: info.getValue() ? 'success.main' : 'error.main',
                    }}
                />
            ),
        }),
        {
            id: 'acciones',
            header: () => 'Acciones',
            cell: ({ row }) => (
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(row.original.id)}
                        startIcon={<IconPencil />}
                    >
                        Editar
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(row.original)}
                        startIcon={<IconTrash />}
                    >
                        Desactivar
                    </Button>
                </Stack>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        filterFns: {},
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <DownloadCard title="Municipios">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableCell key={header.id}>
                                                    <Typography
                                                        variant="h6"
                                                        mb={1}
                                                        className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(header.column.columnDef.header, header.getContext())
                                                        }
                                                        {(() => {
                                                            const sortState = header.column.getIsSorted();
                                                            if (sortState === 'asc') return ' 🔼';
                                                            if (sortState === 'desc') return ' 🔽';
                                                            return null;
                                                        })()}
                                                    </Typography>                                                </TableCell>
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
                        </TableContainer>
                        <Divider />
                        <Stack direction="row" justifyContent="space-between" alignItems="center" p={3}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography>
                                    Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                                </Typography>
                                <CustomTextField
                                    type="number"
                                    min="1"
                                    max={table.getPageCount()}
                                    defaultValue={table.getState().pagination.pageIndex + 1}
                                    onChange={(e) => {
                                        const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                        table.setPageIndex(page);
                                    }}
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
                    </Box>
                </Grid>
            </Grid>
        </DownloadCard>
    );
};

export default UsuariosPaginationTable;
