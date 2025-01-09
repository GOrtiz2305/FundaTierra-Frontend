import React from 'react'
import { useParams } from 'react-router';
import EditarAnticipoGastosForm from '../../../components/forms/documentos-forms/EditarAnticipoGastosForm';

const EditarAnticipoGasto = () => {
    const { id } = useParams();

    return (
        <EditarAnticipoGastosForm id={id} />
    )
}

export default EditarAnticipoGasto
