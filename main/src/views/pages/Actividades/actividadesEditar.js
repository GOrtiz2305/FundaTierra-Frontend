import React from 'react'
import ActividadesEditarForm from '../../../components/forms/actividades-forms/EditarForm';
import { useParams } from 'react-router';

const ActividadesEditar = () => {
    const { id } = useParams();
    
    return (
        <div>
            <ActividadesEditarForm  id={id} />
        </div>
    )
}

export default ActividadesEditar
