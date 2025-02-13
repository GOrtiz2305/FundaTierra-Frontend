import React from 'react';
import DashDocumentos from '../Documentos/DashDocumentos';
import { useParams, useLocation } from 'react-router';

const ActividadesDocumentos = () => {
    const { id } = useParams();
    const location = useLocation();
    const nombre = location.state?.nombre || 'Sin nombre';

    return (
        <div>
            <DashDocumentos id={id} nombreActividad={nombre} />
        </div>
    );
};

export default ActividadesDocumentos;
