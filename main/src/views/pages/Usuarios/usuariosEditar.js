import React from 'react'
import UsuariosEditarForm from '../../../components/forms/usuarios-forms/EditarForm'
import { useParams } from 'react-router'
const UsuariosEditar = () => {
    const { id } = useParams();
    return (
        <div>
            <UsuariosEditarForm id={id} />
        </div>
    )
}

export default UsuariosEditar
