export const getCustomerList = async() => {
    const url = `http://localhost:8080/customers`
    const resp = await fetch(url, {
        method: 'GET',
        headers: {
            apiKey: 'LLBtFuKS4whp3Vg8dapMwRTEyrE92c6p'
        }
    });
    const data = await resp.json();    
    return data;
 }

 export const getCustomerById = async(id) => {
    const url = `http://localhost:8080/customers/${id}`
    const resp = await fetch(url, {
        method: 'GET',
        headers: {
            apiKey: 'LLBtFuKS4whp3Vg8dapMwRTEyrE92c6p'
        }
    });
    const data = await resp.json();    
    return data;
 }

 export const addCustomer = async(customers) => {     
    const url = `http://localhost:8080/customers`;    
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            apiKey: 'LLBtFuKS4whp3Vg8dapMwRTEyrE92c6p'
        },
        body: JSON.stringify(customers)
    });
    const data = await resp.json();    
    return data;
 }

 export const updateCustomer = async(id, customers) => {  
    delete customers._id;   
    const url = `http://localhost:8080/customers/${id}`;    
    const resp = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            apiKey: 'LLBtFuKS4whp3Vg8dapMwRTEyrE92c6p'
        },
        body: JSON.stringify(customers)
    });
    const data = await resp.json();    
    return data;
 }

 export const deleteCustomerById = async(id) => {
    const url = `http://localhost:8080/customers/${id}`
    const resp = await fetch(url, {
        method: 'Delete',
        headers: {
            apiKey: 'LLBtFuKS4whp3Vg8dapMwRTEyrE92c6p'
        }
    });
    const data = await resp.json();    
    return data;
 }