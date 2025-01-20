import React from 'react';
import { useParams } from 'react-router';
import MunicipioEditarForm from '../../../components/forms/departamentosMunicipios-form/EditarFormMuni';


const MunicipiosEditar = () => {
    const { id } = useParams();

    return (
        <div>
            <MunicipioEditarForm  id={id}  />
        </div>
    )
}

export default MunicipiosEditar