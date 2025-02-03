import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { URL } from "../../../../config";
import ParentCard from "../../shared/ParentCard";
import CustomFormLabel from "../theme-elements/CustomFormLabel";
import CustomTextField from "../theme-elements/CustomTextField";

const LineasEstrategicasForm = () => {
  const navigate = useNavigate();
  const [lineasEstrategicas, setLineasEstrategicas] = useState([]);
  const [selectedLinea, setSelectedLinea] = useState("");
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchLineasEstrategicas = async () => {
      try {
        const response = await fetch(`${URL}proyectoLinea`);
        const data = await response.json();
        setLineasEstrategicas(data);
      } catch (error) {
        console.error("Error al obtener las líneas estratégicas", error);
      }
    };
    fetchLineasEstrategicas();
  }, []);

  const handleSave = async (values) => {
    try {
      const response = await fetch(`${URL}proyectoLinea`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setAlert({ type: "success", message: "Línea estratégica creada con éxito" });
        navigate("/proyectoLinea");
      } else {
        setAlert({ type: "error", message: "Error al crear la línea estratégica" });
      }
    } catch (error) {
      console.error("Error al llamar a la API:", error);
      setAlert({ type: "error", message: "Error al llamar a la API" });
    }
  };

  const validationSchema = yup.object({
    nombre: yup.string().required("El nombre de la línea estratégica es necesario"),
  });

  const formik = useFormik({
    initialValues: {
      nombre: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await handleSave(values);
      console.log(values);
    },
  });

  return (
    <ParentCard title="Formulario de Líneas Estratégicas">
      {alert && <Alert variant="filled" severity={alert.type}>{alert.message}</Alert>}
      <form onSubmit={formik.handleSubmit}>
        <CustomFormLabel htmlFor="nombre">Nombre de la Línea Estratégica</CustomFormLabel>
        <CustomTextField
          id="nombre"
          name="nombre"
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.nombre}
          error={formik.touched.nombre && Boolean(formik.errors.nombre)}
          helperText={formik.touched.nombre && formik.errors.nombre}
          onBlur={formik.handleBlur}
          fullWidth
        />

        <br /><br />
        <FormControl fullWidth>
          <InputLabel id="lineas-label">Líneas Estratégicas</InputLabel>
          <Select
            labelId="lineas-label"
            value={selectedLinea}
            onChange={(e) => setSelectedLinea(e.target.value)}
          >
            {lineasEstrategicas.map((linea) => (
              <MenuItem key={linea.id} value={linea.id}>
                {linea.nombre}
                <Button
                  color="secondary"
                  onClick={() => navigate(`/editarLinea/${linea.id}`)}
                  style={{ marginLeft: "10px" }}
                >
                  Editar
                </Button>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <br /><br />
        <div>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Guardar
          </Button>
        </div>
      </form>
    </ParentCard>
  );
};

export default LineasEstrategicasForm;

