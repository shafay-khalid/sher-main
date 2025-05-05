import React from 'react'
import {Route ,Routes } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Forgotpassword from './Forgotpasssword'



export default function Auth() {
  return (
    <Routes>
      <Route path='login' element = {<Login/>}/>
      <Route path='register' element = {<Register/>}/>
      <Route path='forgotpassword' element = {<Forgotpassword/>}/>
      <Route path='*' element={<h1>No Page, Auth Page Not Found, 404 Error</h1>} />
   </Routes>
  )
}
