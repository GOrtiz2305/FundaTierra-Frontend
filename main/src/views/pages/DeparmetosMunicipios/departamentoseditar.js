import React from 'react';
import { useParams } from 'react-router';
import DepartamentosEditarForm from '../../../components/forms/departamentosMunicipios-form/EditarFormDep';


const DepartamentosEditar = () => {
    const { id } = useParams();

    
    return (
        <div>
            <DepartamentosEditarForm  id={id}  />
        </div>
    )
}

export default DepartamentosEditar