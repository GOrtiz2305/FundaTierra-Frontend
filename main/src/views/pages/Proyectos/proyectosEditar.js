import React from 'react';
import { useParams } from 'react-router';
import ProyectosEditarForm from '../../../components/forms/proyectos-forms/EditarForm';


const proyectosEditar = () => {
    const { id } = useParams();

    
    return (
        <div>
            <ProyectosEditarForm  id={id}  />
        </div>
    )
}

export default proyectosEditar
