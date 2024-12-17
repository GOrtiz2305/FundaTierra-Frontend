import React from 'react'
import { useParams } from 'react-router'
import AnticipoGastosForm from '../../../components/forms/documentos-forms/AnticipoGastosForm';

const AnticipoGastos = () => {
    const {id} = useParams();

    return (
        <AnticipoGastosForm id={id} />
    )
}

export default AnticipoGastos
