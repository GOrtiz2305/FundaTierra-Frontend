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
    Typography
} from '@mui/material';
import { Stack } from '@mui/system';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';
import { useNavigate } from 'react-router';
import axios from 'axios';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import DownloadCard from 'src/components/shared/DownloadCard';
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconPencil, IconTrash } from '@tabler/icons';
import { URL } from "../../../../../config";

const columnHelper = createColumnHelper();

const MunicipiosPaginationTable = () => {
    const [data, setData] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMunicipios = async () => {
            try {
                const response = await axios.get(`${URL}municipios`);
                setData(response.data);
            } catch (error) {
                console.error("Error al obtener municipios:", error);
            }
        };
        fetchMunicipios();
    }, []);

    const handleEdit = (id) => {
        navigate(`/DepartamentosMunicipios/editarMunicipios/${id}`);
    };

    const handleDelete = async (row) => {
        try {
            await axios.put(`${URL}municipios/eliminar/${row.id}`);
            setData((prevData) => prevData.filter((item) => item.id !== row.id));
        } catch (error) {
            console.error("Error al eliminar municipio:", error);
        }
    };

    const columns = [
        columnHelper.accessor('nombre', {
            header: () => 'Nombre',
            cell: info => (
                <Typography variant="subtitle1" color="textSecondary">
                    {info.getValue()}
                </Typography>
            ),
        }),
        columnHelper.accessor('departamento.nombre', {
            header: () => 'Departamento',
            cell: info => (
                <Typography variant="subtitle1" color="textSecondary">
                    {info.getValue()}
                </Typography>
            ),
        }),
        columnHelper.accessor('estado', {
            header: () => 'Estado',
            meta: {
                filterVariant: 'checkbox', // 'checkbox' | 'radio' | 'select' | 'multiselect'
            },
            cell: info => (
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
                        color="primary"
                        onClick={() => handleEdit(row.original.id)}
                        startIcon={<IconPencil width={18} />}
                    >
                        Editar
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(row.original)}
                        startIcon={<IconTrash width={18} />}
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
        state: { columnFilters },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
    });

    const handleDownload = () => {
        const headers = ["nombre", "departamento", "estado"];
        const rows = data.map((item) => [item.nombre, item.departamento.nombre, item.estado ? 'Activo' : 'Inactivo']);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "municipios.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <DownloadCard title="Municipios" onDownload={handleDownload}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box>
                        <TableContainer>
                            <Table sx={{ whiteSpace: 'nowrap' }}>
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

export default MunicipiosPaginationTable;
