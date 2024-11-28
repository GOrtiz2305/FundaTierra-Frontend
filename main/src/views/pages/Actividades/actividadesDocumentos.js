import React from 'react'
import DashDocumentos from '../Documentos/DashDocumentos'
import { useParams } from 'react-router';

const ActividadesDocumentos = () => {
    const { id } = useParams();

    return (
        <div>
            <DashDocumentos id={id} />
        </div>
    )
}

export default ActividadesDocumentos
