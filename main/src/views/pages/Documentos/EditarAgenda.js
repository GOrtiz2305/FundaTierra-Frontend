import React from 'react'
import { useParams } from 'react-router';
import EditarAgendaForm from '../../../components/forms/documentos-forms/EditarAgendaForm';

const EditarAgenda = () => {
    const { id } = useParams();

    return (
        <EditarAgendaForm id={id} />
    )
}

export default EditarAgenda
