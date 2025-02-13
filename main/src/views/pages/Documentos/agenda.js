import React from 'react'
import AgendaForm from '../../../components/forms/documentos-forms/AgendaForm'
import { useParams, useLocation } from 'react-router';

const Agenda = () => {
  const { id } = useParams();
  const location = useLocation();
  const nombre = location.state?.nombreActividad || 'Sin nombre';

  return (
    <AgendaForm id={id} nombreActividad={nombre}/>
  )
}

export default Agenda
