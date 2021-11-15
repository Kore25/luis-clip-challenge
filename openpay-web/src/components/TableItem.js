import React from 'react'
import { Link } from 'react-router-dom'

export default function TableItem({_id, name, last_name, email, phone_number}) {

    return (
        <tr>         
            <td>{name}</td>
            <td>{last_name}</td>
            <td>{email}</td>
            <td>{phone_number}</td>
            <td>                
                <Link className="btn btn-primary" to={`/customer/${_id}`}>Edit</Link>
            </td> 
        </tr>
    )
}
