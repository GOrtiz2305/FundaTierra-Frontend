import React from 'react'
import MemoriaForm from '../../../components/forms/documentos-forms/MemoriaForm'
import { useParams } from 'react-router';

const Memoria = () => {
    const { id } = useParams();

    return (
        <MemoriaForm id={id} />
    )
}

export default Memoria
