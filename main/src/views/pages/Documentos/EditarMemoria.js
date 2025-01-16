import React from 'react'
import { useParams } from 'react-router';
import EditarMemoriaForm from '../../../components/forms/documentos-forms/EditarMemoriaForm';

const EditarMemoria = () => {
    const { id } = useParams();

    return (
        <EditarMemoriaForm id={id} />
    )
}

export default EditarMemoria
