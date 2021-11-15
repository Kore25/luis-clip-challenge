import useForm from "../hooks/useForm";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function CustomerAdd() {     
    const { id } = useParams();        
    const [formValues, handleSummit, handleInputChange, handleCustomerId, handleDeleteCustomer] = useForm({
        name: '',
        last_name: '',
        email: '',
        phone_number: '',
    });

    useEffect(() => {
        handleCustomerId(id)
    }, []);

    const {name, last_name, email, phone_number} = formValues;

    return (
        <div className="d-flex justify-content-center">
            <form className="data-form-customer" onSubmit={(e) => handleSummit(e, id)}>        
                <h1>Customer</h1>
                <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control" name="name" value={name} onChange={ handleInputChange }/>            
                </div>
                <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control" name="last_name" value={last_name} onChange={ handleInputChange }/>            
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" value={email} onChange={ handleInputChange }/>            
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input type="text" className="form-control" name="phone_number" value={phone_number} onChange={ handleInputChange }/>            
                </div>
               <button type="submit" className="btn btn-primary me-2"> { id ? 'Upate':'Create'} Customer</button>                
               {id &&  <button type="button" className="btn btn-danger" onClick={ (e) => handleDeleteCustomer(id)}>Delete</button>}
            </ form>
        </div>
    )
}
