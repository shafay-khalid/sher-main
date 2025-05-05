import React from 'react'
import Header from '../../components/Header'
import {Route, Routes } from 'react-router-dom'
import Home from './Home'
import Footer from '../../components/Footer'
import Registered from './Registered'
import ItemDetails from './ItemDetails'
import Cart from './Cart'
import Wishlist from './Wishlist'
import CategoryPage from './CategoryPage'
import Checkout from './Checkout'
import RecentOrders from './RecentOrders'

export default function Frontend() {
  return (
    <>
    <Header/>
    <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path="/item/:id" element={<ItemDetails/>} />
        <Route path="/category/:categoryName" element={<CategoryPage/>} />
        <Route path='cart' element={<Cart/>}></Route>
        <Route path='wishlist' element={<Wishlist/>}></Route>
        <Route path='checkout' element={<Checkout/>}></Route>
        <Route path='orders' element={<RecentOrders/>}></Route>
        <Route path='registered' element={<Registered/>}></Route>
        <Route path='*' element={<h1>No Page, Page Not Found, 404 Error</h1>} />
    </Routes>
    <Footer/>
      
    </>
  )
}
