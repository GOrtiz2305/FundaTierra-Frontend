import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
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
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconPencil,
  IconTrash,
} from '@tabler/icons';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { URL } from '../../../../../config';

const columnHelper = createColumnHelper();

const TablePersonas = () => {
  const [data, setData] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const response = await axios.get(`${URL}personas`);
        setData(response.data);
      } catch (error) {
        console.error('Error al obtener las personas:', error);
      }
    };
    fetchPersonas();
  }, []);

  const handleEdit = (id) => {
    navigate(`/personas/editar/${id}`);
  };

  const handleDelete = async (persona) => {
    try {
      await axios.put(`${URL}personas/eliminar/${persona.id}`);
      setData((prevData) => prevData.filter((item) => item.id !== persona.id));
    } catch (error) {
      console.error('Error al eliminar la persona:', error);
    }
  };

  const columns = [
    columnHelper.accessor((row) => `${row.nombre}, ${row.apellido}`, {
      id: 'nombreCompleto',
      header: () => 'Nombre Completo',
      cell: (info) => (
        <Typography variant="subtitle1" color="textSecondary">
          {info.getValue()}
        </Typography>
      ),
    }),
    columnHelper.accessor('sexo', {
      header: () => 'Sexo',
      cell: (info) => (
        <Typography variant="subtitle1" color="textSecondary">
          {info.getValue()}
        </Typography>
      ),
    }),
    columnHelper.accessor('telefono', {
      header: () => 'Teléfono',
      cell: (info) => (
        <Typography variant="subtitle1" color="textSecondary">
          {info.getValue()}
        </Typography>
      ),
    }),
    columnHelper.accessor('correo_electronico', {
      header: () => 'Correo Electrónico',
      cell: (info) => (
        <Typography variant="subtitle1" color="textSecondary">
          {info.getValue()}
        </Typography>
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
            Eliminar
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
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
      <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}>
        <Typography variant="body2">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            <IconChevronsLeft />
          </IconButton>
          <IconButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <IconChevronLeft />
          </IconButton>
          <IconButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <IconChevronRight />
          </IconButton>
          <IconButton onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            <IconChevronsRight />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TablePersonas;
