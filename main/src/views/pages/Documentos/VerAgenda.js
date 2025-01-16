import React from 'react'
import { useParams } from 'react-router';
import VerAgendaForm from '../../../components/forms/documentos-forms/VerAgendaForm';

const VerAgenda = () => {
    const { id } = useParams();

    return (
        <VerAgendaForm id={id} />
    )
}

export default VerAgenda
