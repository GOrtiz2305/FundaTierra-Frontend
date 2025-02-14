import React from 'react'
import PresupuestoForm from '../../../components/forms/documentos-forms/Presupuesto/PresupuestoForm'
import { useParams } from 'react-router';

const Presupuesto = () => {
  const { id } = useParams();

  return (
    <PresupuestoForm id={id}/>
  )
}

export default Presupuesto
