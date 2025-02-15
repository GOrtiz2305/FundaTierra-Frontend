import React from 'react'
import { useParams } from 'react-router';
import VerPresupuestoForm from '../../../components/forms/documentos-forms/VerPresupuestoForm';

const VerPresupuesto = () => {
    const { id } = useParams();

    return (
        <VerPresupuestoForm id={id} />
    )
}

export default VerPresupuesto
