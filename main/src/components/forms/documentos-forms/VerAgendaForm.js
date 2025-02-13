import React, { useState, useEffect, memo } from 'react';
import {
  Typography,
  Alert,
  Grid,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Modal,
  Box
} from '@mui/material';
import ParentCard from '../../shared/ParentCard';
import { URL } from "../../../../config";
import { styled } from '@mui/material/styles';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const VerAgendaForm = ({ id }) => {
  const [actividad, setActividad] = useState({ nombre: "" });
  const [agenda, setAgenda] = useState({
    id: 0,
    nombre: '',
    lugar: '',
    fecha: '',
    responsable: '',
    puntos_agenda: [],
    contenido: {},
  });
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const CustomFormLabel = styled((props) => (
    <Typography
      variant="subtitle1"
      fontWeight={600}
      {...props}
      component="label"
      htmlFor={props.htmlFor}
    />
  ))(() => ({
    marginBottom: '5px',
    marginTop: '25px',
    display: 'block',
  }));

  useEffect(() => {
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

    const fetchAgenda = async () => {
      try {
        const response = await fetch(`${URL}api/documentos/${id}/13`);
        if (response.ok) {
          const data = await response.json();
          setAgenda(data);
        } else {
          console.error('Error al obtener la agenda');
        }
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
    };

    if (id) {
      fetchAgenda();
    }

    fetchActividad();
  }, [id]);

  // Función para generar el PDF
  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18).setFont(undefined, 'bold');
    doc.text("Fundación Tierra Nuestra", 110, 10, { align: 'center' });
    doc.setFontSize(10).setFont(undefined, 'normal');
    doc.text(`Calle "A" 23-84, zona 1 `, 110, 15, { align: 'center' });
    doc.text("Quetzaltenango", 110, 19, { align: 'center' });
    doc.setFontSize(12).setFont(undefined, 'bold')
    doc.text("ACTIVIDAD", 110, 24, { align: 'center' });

    const table = doc.autoTable({
      body: [
        ['Actividad a Realizar:', ` ${actividad.nombre}`],
        ['Lugar de la Actividad:', `${agenda.contenido.lugar || "N/A"}`],
        ['Fecha de la Actividad:', `${agenda.contenido.fecha || "N/A"}`],
        ['Con cargo al Proyecto:', `N/A`],
        ['Con cargo al Rubro:', `N/A`],
        ['Responsable:', `${agenda.contenido.responsable || "N/A"}`]
      ],
      startY: 35,
      theme: 'grid',
      styles: { 
        fontSize: 12, 
        cellPadding: { top: 1, right: 2, bottom: 1, left: 5 }, 
        textColor: [0, 0, 0], 
        lineWidth: 0.5, 
      },
      columnStyles: {
        0: { cellWidth: 55 }, 
        1: { cellWidth: 125 } 
      },
    });
    
    // Verificar si la tabla se generó correctamente
    const tableData = table.lastAutoTable;

    if (tableData && tableData.startX !== undefined && tableData.startY !== undefined) {
      const x = Number(tableData.startX) || 10;
      const y = Number(tableData.startY) || 10;
      const width = Number(tableData.width) || 180;
      const height = Number(tableData.height) || 80;
      const radius = 5; // Radio de esquinas

      console.log("Valores de la tabla para roundedRect:");
      console.log({ x, y, width, height, radius });

      if (!isNaN(x) && !isNaN(y) && !isNaN(width) && !isNaN(height) && !isNaN(radius)) {
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.roundedRect(x, y, width, height, radius, radius);
      } else {
        console.error("Error: Valores inválidos en roundedRect.");
      }
    } else {
      console.error("Error: No se pudo obtener la tabla correctamente.");
    }

    const nextTableStartY = doc.lastAutoTable.finalY + 10

    if (agenda.contenido.puntos_agenda?.length > 0) {
      doc.autoTable({
        startY: nextTableStartY,
        head: [['Horario', 'Punto de Agenda', 'Responsable']],
        body: agenda.contenido.puntos_agenda.map(item => [
          item.horario || "N/A",
          item.punto || "N/A",
          item.responsablePunto || "N/A"
        ])
      });
    } else {
      doc.text("No hay puntos en la agenda.", 14, 70);
    }

    const pdfBlob = doc.output('blob');
    const pdfUrl = window.URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
    setOpen(true);
  };

  return (
    <ParentCard title="Agenda">
      <Alert severity="info">I. Detalles de la Actividad</Alert>
      <Grid container spacing={3} mb={3}>
        <Grid item lg={6} md={12}>
          <CustomFormLabel htmlFor="actividad">Actividad</CustomFormLabel>
          <TextField id="actividad" variant="outlined" value={actividad.nombre} fullWidth />
        </Grid>
        <Grid item lg={6} md={12}>
          <CustomFormLabel htmlFor="lugar">Lugar</CustomFormLabel>
          <TextField id="lugar" variant="outlined" value={agenda.contenido.lugar || ''} fullWidth />
        </Grid>
        <Grid item lg={6} md={12}>
          <CustomFormLabel htmlFor="fecha">Fecha</CustomFormLabel>
          <TextField id="fecha" type="date" variant="outlined" value={agenda.contenido.fecha || ''} fullWidth />
        </Grid>
        <Grid item lg={6} md={12}>
          <CustomFormLabel htmlFor="responsable">Responsable</CustomFormLabel>
          <TextField id="responsable" variant="outlined" value={agenda.contenido.responsable || ''} fullWidth />
        </Grid>
      </Grid>

      <Alert severity="info">II. Puntos de la Agenda</Alert>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Horario</TableCell>
            <TableCell>Punto de Agenda</TableCell>
            <TableCell>Responsable</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {agenda.contenido.puntos_agenda?.length > 0 ? (
            agenda.contenido.puntos_agenda.map((item, index) => (
              <TableRow key={index}>
                <TableCell><TextField type="time" value={item.horario} fullWidth /></TableCell>
                <TableCell><TextField value={item.punto} fullWidth /></TableCell>
                <TableCell><TextField value={item.responsablePunto} fullWidth /></TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center">No hay puntos en la agenda.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <br />

      <Button variant="contained" color="success" style={{ marginTop: '20px' }}>
        Aprobar documento
      </Button>
      <Button variant="contained" color="error" style={{ marginTop: '20px', marginLeft: '10px' }}>
        Solicitar correcciones
      </Button>
      <Button variant="contained" color="primary" style={{ marginTop: '20px', marginLeft: '10px' }} onClick={generarPDF}>
        Ver PDF
      </Button>

      {/* Modal para ver el PDF */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Vista previa del PDF
          </Typography>
          <iframe src={pdfUrl} width="100%" height="500px" style={{ border: 'none' }}></iframe>
          <Button variant="contained" color="primary" onClick={() => setOpen(false)} style={{ marginTop: '10px' }}>
            Cerrar
          </Button>
        </Box>
      </Modal>
    </ParentCard>
  );
};

export default VerAgendaForm;
