
import { Link } from "react-router-dom";
import { useFetchCustomer } from "../hooks/useFetchCustomer";
import TableItem from "./TableItem";

export default function CustomerTable() {
    const {data: customers, loading} = useFetchCustomer();    
    return (
        <div className="p-5">
            <div className='d-flex justify-content-between'>
                <h1>Customers List</h1>
                <div>
                    <Link className='btn btn-primary' to="/customer">Add new Customer</Link>
                </div>
            </div>
            { loading && <p className="animate__animated animate__flash">Loading</p> }
            <table className="table">
                <thead>
                    <tr>                    
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone Number</th>
                        <th scope="col">Edit</th>
                    </tr>
                </thead>
                <tbody>            
                {
                    customers.map(customer => 
                        <TableItem
                            key={customer._id}
                            {... customer}
                        />
                    )
                }
                </tbody>
            </table>        
        </div>        
    )
}
