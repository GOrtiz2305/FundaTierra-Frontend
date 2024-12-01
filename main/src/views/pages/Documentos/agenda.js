import React from 'react'
import AgendaForm from '../../../components/forms/documentos-forms/AgendaForm'
import { useParams } from 'react-router';

const Agenda = () => {
  const { id } = useParams();

  return (
    <AgendaForm id={id}/>
  )
}

export default Agenda
