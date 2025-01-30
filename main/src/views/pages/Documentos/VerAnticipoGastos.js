import React from 'react'
import { useParams } from 'react-router';
import VerAnticipoGastosForm from '../../../components/forms/documentos-forms/VerAnticipoGastosForm';

const VerAnticipoGastos = () => {
    const { id } = useParams();

    return (
        <VerAnticipoGastosForm id={id} />
    )
}

export default VerAnticipoGastos
