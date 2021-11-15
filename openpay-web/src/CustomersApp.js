import React from 'react';
import {Routes, Route, BrowserRouter } from 'react-router-dom';
import CustomerAdd from './components/CustomerAdd';
import CustomerTable from './components/CustomerTable';
import Navbar from './components/Navbar';

function CustomersApp() {
    return (
        <BrowserRouter>
            <div>
                <Navbar />
                <Routes>
                    <Route path='/' element={<CustomerTable />} />
                    <Route path='/customer' element={<CustomerAdd />} />
                    <Route path='/customer/:id' element={<CustomerAdd />} />     
                </Routes>                
            </div>
        </BrowserRouter>
    )
}

export default CustomersApp

