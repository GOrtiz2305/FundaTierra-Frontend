import React from 'react';
import { useParams } from 'react-router';
import ProyectosVer from '../Documentos/ProyectosVer';

const ProyectosVisualizar = () => {
    const { id } = useParams();

    return (
        <div>
            <ProyectosVer id={id} />
        </div>
    )
}

export default ProyectosVisualizar
