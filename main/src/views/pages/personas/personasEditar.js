import React from 'react'
import PersonasEditarForm from '../../../components/forms/personas-forms/EditarForm'
import { useParams } from 'react-router'

const PersonasEditar = () => {
        const { id } = useParams();
    return (
        <div>
            <PersonasEditarForm id={id} />
        </div>
    )
}

export default PersonasEditar
