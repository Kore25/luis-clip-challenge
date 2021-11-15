import { useState, useEffect } from "react"
import { getCustomerList } from "../helpers/fetchCustomer";

export const useFetchCustomer = () => {    
    const [customers, setCustomers] = useState({
        data: [],
        loading: true
    });

    useEffect( () => {
        getCustomerList()
            .then(customs => { 
                setCustomers({ 
                    data: customs,
                    loading: false                
                });    
            });

    }, []);


    return customers;
}