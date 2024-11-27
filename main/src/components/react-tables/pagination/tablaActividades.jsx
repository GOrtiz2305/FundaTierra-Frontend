import * as React from 'react';
import {
    TableContainer,
    Table,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    TableHead,
    Chip,
    Box,
    Grid, MenuItem,
    Button,
    Divider,
    IconButton
} from '@mui/material';
import { Stack } from '@mui/system';
import DownloadCard from 'src/components/shared/DownloadCard';

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    createColumnHelper
} from '@tanstack/react-table'
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import { IconPencil, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconTrash } from '@tabler/icons';
import axios from 'axios';
import { URL } from "../../../../config";
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useState } from 'react';

const columnHelper = createColumnHelper();

const columns = [

    columnHelper.accessor('usuario.username', {
        header: () => 'Usuario',
        cell: info => (
            <Typography variant="subtitle1" color="textSecondary">
                {info.getValue()}
            </Typography>
        ),
    }),
    columnHelper.accessor('nombre', {
        header: () => 'Nombre',
        cell: info => (
            <Typography variant="subtitle1" color="textSecondary">
                {info.getValue()}
            </Typography>
        ),
    }),
    columnHelper.accessor('proyecto.nombre', {
        header: () => 'Proyecto',
        cell: info => (
            <Typography variant="subtitle1" color="textSecondary">
                {info.getValue()}
            </Typography>
        ),
    }),
    columnHelper.accessor('fecha_inicio', {
        header: () => 'Fecha de inicio',
        cell: info => (
            <Typography variant="subtitle1" color="textSecondary">
                {info.getValue()}
            </Typography>
        ),
    }),
    columnHelper.accessor('estado_actividade.nombre', {
        header: () => 'Estado',
        meta: {
            filterVariant: 'select',
        },
        cell: info => (
            <Chip
                sx={{
                    bgcolor:
                        info.getValue() === 'En Progreso'
                            ? (theme) => theme.palette.success.light
                            : info.getValue() === 'Pendiente'
                                ? (theme) => theme.palette.warning.light
                                : info.getValue() === 'Completado'
                                    ? (theme) => theme.palette.primary.light
                                    : info.getValue() === 'Cancelado'
                                        ? (theme) => theme.palette.error.light
                                        : (theme) => theme.palette.secondary.light,
                    color:
                        info.getValue() === 'En Progreso'
                            ? (theme) => theme.palette.success.main
                            : info.getValue() === 'Pendiente'
                                ? (theme) => theme.palette.warning.main
                                : info.getValue() === 'Completado'
                                    ? (theme) => theme.palette.primary.main
                                    : info.getValue() === 'Cancelado'
                                        ? (theme) => theme.palette.error.main
                                        : (theme) => theme.palette.secondary.main,
                    borderRadius: '8px',
                }}
                label={info.getValue()}
            />
        ),
    }),
];

const ActividadesPaginationTable = () => {
    const [data, setData] = useState(() => []);
    const [columnFilters, setColumnFilters] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActividades = async () => {
            try {
                const response = await axios.get(`${URL}actividades`);
                setData(response.data);
            } catch (error) {
                console.error("Error al obtener actividades:", error);
            }
        };
        fetchActividades();
    }, []);

    const handleEdit = (id) => {
        navigate(`/actividades/cambios/${id}`);  // Redirige a la página de cambios con el id
    };

    const table = useReactTable({
        data,
        columns,
        filterFns: {},
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(), //client side filtering
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
    });

    const handleDownload = () => {
        const headers = ["usuario", "nombre", "proyecto", "fecha_inicio", "estado"];
        const rows = data.map(item => [
            item.usuario,
            item.nombre,
            item.proyecto,
            item.fecha_inicio,
            item.estado,
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(e => e.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "table-data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <DownloadCard title="Actividades" onDownload={handleDownload}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box>
                        <TableContainer>
                            <Table
                                sx={{
                                    whiteSpace: 'nowrap',
                                }}
                            >
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
                                                    </Typography>
                                                </TableCell>
                                            ))}
                                            <TableCell>
                                                <Typography
                                                    variant="h6"
                                                    mb={1}
                                                >
                                                    Acciones
                                                </Typography>
                                            </TableCell>
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
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleEdit(row.original.id)}  // Pasar el id aquí
                                                        startIcon={<IconPencil width={18} />}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="info"
                                                        onClick={() => handleViewDetails(row.original)}
                                                    >
                                                        Ver Detalles
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => handleDelete(row.original)}
                                                        startIcon={<IconTrash width={18} />}
                                                    >
                                                        Borrar
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Divider />
                        <Stack gap={1} p={3} alignItems="center" direction="row" justifyContent="space-between">
                            {/* <Box display="flex" alignItems="center" gap={1}>
                                <Button variant="contained" color="primary" onClick={() => rerender()}>Force Rerender</Button>
                                <Typography variant="body1">{table.getPrePaginationRowModel().rows.length} Rows</Typography>
                            </Box> */}
                            <Box display="flex" alignItems="center" gap={1}>

                                <Stack direction="row" alignItems="center" gap={1}>
                                    <Typography variant="body1">Páginas</Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {table.getState().pagination.pageIndex + 1} de {' '}
                                        {table.getPageCount()}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" gap={1}>
                                    | Ir a la página:
                                    <CustomTextField
                                        type="number"
                                        min="1"
                                        max={table.getPageCount()}
                                        defaultValue={table.getState().pagination.pageIndex + 1}
                                        onChange={(e) => {
                                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                                            table.setPageIndex(page)
                                        }}
                                    />
                                </Stack>
                                <CustomSelect
                                    value={table.getState().pagination.pageSize}
                                    onChange={(e) => {
                                        table.setPageSize(Number(e.target.value))
                                    }}
                                >
                                    {[10, 15, 20, 25].map(pageSize => (
                                        <MenuItem key={pageSize} value={pageSize}>
                                            {pageSize}
                                        </MenuItem>
                                    ))}
                                </CustomSelect>

                                <IconButton size='small'
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <IconChevronsLeft />
                                </IconButton>
                                <IconButton size='small'
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <IconChevronLeft />
                                </IconButton>
                                <IconButton size='small'
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <IconChevronRight />
                                </IconButton>
                                <IconButton size='small'
                                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <IconChevronsRight />
                                </IconButton>
                            </Box>
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
        </DownloadCard>

    );
};

export default ActividadesPaginationTable;
