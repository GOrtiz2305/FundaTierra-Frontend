import { Box, Button, Chip, Divider, Grid, IconButton, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconPencil, IconTrash } from '@tabler/icons';
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import * as React from 'react';
import { useNavigate } from 'react-router';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import DownloadCard from 'src/components/shared/DownloadCard';
import { URL } from "../../../../config";
import axios from 'axios';

const columnHelper = createColumnHelper();

const ProyectosPaginationTable = () => {
    const [data, setData] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState(""); // Para el término de búsqueda
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Día con dos dígitos
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes con dos dígitos
        const year = date.getFullYear(); // Año
    
        return `${day}/${month}/${year}`;
    };

    React.useEffect(() => {
        const fetchProyectos = async () => {
            try {
                const response = await axios.get(`${URL}proyectos`)
                const proyectosFinalizados = response.data.filter(proyecto => proyecto.id_estado === 2)
                const proyectosConFechasFormateadas = proyectosFinalizados.map(proyecto => ({
                    ...proyecto,
                    fecha_inicio: formatDate(proyecto.fecha_inicio),
                    fecha_fin: formatDate(proyecto.fecha_fin),
                }));
    
                setData(proyectosConFechasFormateadas);
            } catch (error) {
                console.error("Error al obtener proyectos:", error);
            }
        };
        fetchProyectos();
    }, []);

    const handleSearchChange = (event) => {
        const Buscar = event.target.value.trim(); // Evita espacios en blanco al inicio y final
    
        setSearchTerm(Buscar); // Actualiza el término de búsqueda
    
        if (Buscar === "") {
            setColumnFilters([])
        } else {
            // Si hay un término de búsqueda, aplica filtros adecuados
            const conjuntoLetras = /[A-Za-z]/
            const fechaRegex1 = /^(0[1-9]|[12][0-9]|3[01])\//
            const fechaRegex2 = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\//
            const fechaRegex3 = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
            const numeroDecimalRegex = /^[0-9]+(\.[0-9]+)?$/
    
            if (conjuntoLetras.test(Buscar) || numeroDecimalRegex.test(Buscar)) {
                setColumnFilters([
                    {
                        id: 'alias',
                        value: Buscar
                    }
                ]);
            } else if (fechaRegex1.test(Buscar) || fechaRegex2.test(Buscar) || fechaRegex3.test(Buscar)) {
                setColumnFilters([
                    {
                        id: 'fecha_inicio',
                        value: Buscar
                    }
                ]);
            } else if (numeroDecimalRegex.test(Buscar)) {
                setColumnFilters([
                    {
                        id: 'presupuesto',
                        value: Buscar
                    }
                ]);
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/Proyectos/cambios/${id}`);
    };

    const handleViewDetails = (id) => {
        navigate(`/proyectos/detalle/${id}`);
    };

    const columns = [
        columnHelper.accessor('alias', {
            header: () => 'Nombre (Alias)',
            cell: (info) => <Typography variant="subtitle1" color="textSecondary">{info.getValue()}</Typography>,
        }),
        columnHelper.accessor('fecha_inicio', {
            header: () => 'Fecha inicio',
            cell: (info) => <Typography variant="subtitle1" color="textSecondary">{info.getValue()}</Typography>,
        }),
        columnHelper.accessor('fecha_fin', {
            header: () => 'Fecha fin',
            cell: (info) => <Typography variant="subtitle1" color="textSecondary">{info.getValue()}</Typography>,
        }),
        columnHelper.accessor('presupuesto', {
            header: () => 'Presupuesto',
            cell: (info) => <Typography variant="subtitle1" color="textSecondary">{info.getValue()}</Typography>,
        }),
        columnHelper.accessor('estado_proyecto.nombre', {
            header: () => 'Estado',
            meta: { filterVariant: 'select' },
            cell: (info) => (
                <Chip
                    sx={{
                        bgcolor: info.getValue() === 'active' ? (theme) => theme.palette.success.light : theme => theme.palette.secondary.light,
                        color: info.getValue() === 'active' ? (theme) => theme.palette.success.main : (theme) => theme.palette.secondary.main,
                        borderRadius: '8px',
                    }}
                    label={info.getValue()}
                />
            ),
        }),
        {
            id: 'acciones',
            header: () => 'Acciones',
            cell: ({ row }) => (
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" color="primary" onClick={() => handleEdit(row.original.id)} startIcon={<IconPencil width={18} />}>Activar</Button>
                </Stack>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        filterFns: {},
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
        const headers = ["nombre", "fecha_inicio", "fecha_fin ", "presupuesto", "estado"];
        const rows = data.map(item => [
            item.nombre,
            item.fecha_inicio,
            item.fecha_fin,
            item.presupuesto,
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
        <DownloadCard title="Proyectos" onDownload={handleDownload}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box>
                        <CustomTextField
                            label="Buscar por nombre"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            fullWidth
                        />
                        <TableContainer>
                            <Table sx={{ whiteSpace: 'nowrap' }}>
                                <TableHead>
                                    {table.getHeaderGroups().map(headerGroup => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map(header => (
                                                <TableCell key={header.id}>
                                                    <Typography variant="h6" mb={1} className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''} onClick={header.column.getToggleSortingHandler()}>
                                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                                    {table.getRowModel().rows.map(row => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map(cell => (
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
                        <Stack gap={1} p={3} alignItems="center" direction="row" justifyContent="space-between">
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
                                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                            table.setPageIndex(page);
                                        }}
                                    />
                                </Stack>
                                <CustomSelect
                                    value={table.getState().pagination.pageSize}
                                    onChange={(e) => {
                                        table.setPageSize(Number(e.target.value));
                                    }}
                                >
                                    {[10, 15, 20, 25].map(pageSize => (
                                        <MenuItem key={pageSize} value={pageSize}>
                                            {pageSize}
                                        </MenuItem>
                                    ))}
                                </CustomSelect>
                                <IconButton size='small' onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                                    <IconChevronsLeft />
                                </IconButton>
                                <IconButton size='small' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                                    <IconChevronLeft />
                                </IconButton>
                                <IconButton size='small' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                                    <IconChevronRight />
                                </IconButton>
                                <IconButton size='small' onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
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

export default ProyectosPaginationTable;
