
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
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconPencil, IconTrash } from '@tabler/icons';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';
import * as React from 'react';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import DownloadCard from 'src/components/shared/DownloadCard';
import { basicsTableData } from '../../tables/tableData';



const basics = basicsTableData;

const columnHelper = createColumnHelper();

const columns = [

    columnHelper.accessor('Nombre', {
        header: () => 'Nombre',
        cell: info => (
            <Typography variant="subtitle1" color="textSecondary">
                {info.getValue()}
            </Typography>
        ),
    }),
    columnHelper.accessor('Fecha Inicio', {
        header: () => 'Fecha Inicio',
        cell: info => (
            <Typography variant="subtitle1" color="textSecondary">
                {info.getValue()}
            </Typography>
        ),
    }),
    columnHelper.accessor('Fecha fin', {
        header: () => 'Fecha fin',
        cell: info => (
            <Typography variant="subtitle1" color="textSecondary">
                {info.getValue()}
            </Typography>
        ),
    }),
    columnHelper.accessor('Presupuestos', {
        header: () => 'Presupuestos',
        cell: info => (
            <Typography variant="subtitle1" color="textSecondary">
                {info.getValue()}
            </Typography>
        ),
    }),
    columnHelper.accessor('estado', {
        header: () => 'Estado',
        meta: {
            filterVariant: 'select',
        },
        cell: info => (
            <Chip
                sx={{
                    bgcolor:
                        info.getValue() === 'active'
                            ? (theme) => theme.palette.success.light
                            : info.getValue() === 'pending'
                                ? (theme) => theme.palette.warning.light
                                : info.getValue() === 'completed'
                                    ? (theme) => theme.palette.primary.light
                                    : info.getValue() === 'cancel'
                                        ? (theme) => theme.palette.error.light
                                        : (theme) => theme.palette.secondary.light,
                    color:
                        info.getValue() === 'active'
                            ? (theme) => theme.palette.success.main
                            : info.getValue() === 'pending'
                                ? (theme) => theme.palette.warning.main
                                : info.getValue() === 'completed'
                                    ? (theme) => theme.palette.primary.main
                                    : info.getValue() === 'cancel'
                                        ? (theme) => theme.palette.error.main
                                        : (theme) => theme.palette.secondary.main,
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
                <Button
                    variant="contained"
                    color="primary"
                    href='/pages/proyectos/cambios'
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
        ),
    },
];

const ProyectosPaginationTable = () => {
    const [data, _setData] = React.useState(() => [...basics]);
    const [columnFilters, setColumnFilters] = React.useState(
        []
    )
    const rerender = React.useReducer(() => ({}), {})[1]

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
        const headers = ["nombre", "fecha_inicio", "fecha_fin ", "presupuestos", "estado"];
        const rows = data.map(item => [

            item.nombre,
            item.fecha_inicio,
            item.fecha_fin,
            item.presupuestos,
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

export default ProyectosPaginationTable;
