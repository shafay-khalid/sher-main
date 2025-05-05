import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import Users from './Users';
import Recent from './Recent';
import Update from './Update';
import AddItems from './AddItems';
import TableOrders from './TableOrders';

export default function Index({ searchQuery }) {
    return (
        <>
            <Routes>
                <Route index element={<Home searchQuery={searchQuery} />} />
                <Route path='/users' element={<Users />} />
                <Route path='/recent-orders' element={<Recent />} />
                <Route path='/update-items' element={<Update />} />
                <Route path='/add-items' element={<AddItems />} />
                <Route path='/table-orders' element={<TableOrders />} />
            </Routes>
        </>
    );
}