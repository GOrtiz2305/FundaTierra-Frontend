import React from 'react'
import { useParams } from 'react-router';
import VerMemoriaForm from '../../../components/forms/documentos-forms/VerMemoriaForm';

const VerMemoria = () => {
    const { id } = useParams();

    return (
        <VerMemoriaForm id={id} />
    )
}

export default VerMemoria
