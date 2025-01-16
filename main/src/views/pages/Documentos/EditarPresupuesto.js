import React from 'react'
import { useParams } from 'react-router';
import EditarPresupuestoForm from '../../../components/forms/documentos-forms/EditarPresupuestoForm';

const EditarPresupuesto = () => {
  const { id } = useParams();

  return (
    <EditarPresupuestoForm id={id}/>
  )
}

export default EditarPresupuesto
