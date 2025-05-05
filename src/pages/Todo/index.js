import React from 'react'
import Todos from './Todos'
import Createtodo from './Createtodo'
import { Route, Routes } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function Todo() {
  return (
    <>
 <Header/>   
 <Routes>
      <Route path='todos' element = {<Todos/>}/>
      <Route path='createtodo' element = {<Createtodo/>}/>
      <Route path='*' element={<h1>No Page, Auth Page Not Found, 404 Error</h1>} />
   </Routes>
   <Footer/>
    </>
  )
}
