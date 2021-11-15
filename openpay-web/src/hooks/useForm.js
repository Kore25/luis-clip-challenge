import { useState } from "react";
import { addCustomer, deleteCustomerById, getCustomerById, updateCustomer } from "../helpers/fetchCustomer";
import { useNavigate } from "react-router-dom";

export default function useForm( initialState = {}) {
    const [values, setValues] = useState(initialState);
    const navigate = useNavigate();

    const handleSummit = async (e, id) => {               
        e.preventDefault();
        let resp = {};        
        if(id)
            resp = await updateCustomer(id, values)
        else
            resp = await addCustomer(values)
        
        if(resp.hasOwnProperty('error')){
            const {error} = resp;
            if(error.status === 400 && error.code === 48){
                alert("The user already exists.");
            }else{
                console.error(error.error, error.details);
                alert('Something happened with the server.');
            }
        }else{            
            alert('Customer saved');
            navigate('/');
        }
    }

    const handleInputChange = ({target}) => {
        setValues({
            ...values,
            [ target.name]: target.value
        })
    }

    const handleCustomerId = async(id) => { 
        if(id){
            const resp = await getCustomerById(id);            
            setValues(resp);
        }       
    }

    const handleDeleteCustomer = async (id) => { 
        const resp = await deleteCustomerById(id);                
        if(resp.hasOwnProperty('error')){
            const {error} = resp;
            console.error(error.error, error.details);
            alert('Something happened with the server.');
        }else{
            alert('Customer was deleted.');
            navigate('/');       
        }
    }  

    return [values, handleSummit, handleInputChange, handleCustomerId, handleDeleteCustomer];
}
