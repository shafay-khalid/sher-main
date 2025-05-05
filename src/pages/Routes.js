import React from 'react'
import { Navigate, Route,Routes } from 'react-router-dom'
import Frontend from './Frontend'
import Auth from './Auth'
import Todo from './Todo'
import DashBoard from './DashBoard'
import { useAuth } from '../context/authContext'
import PrivateRoutes from '../components/PrivateRoutes'

export default function Index() {
  const {state} = useAuth();
  const isAdmin = state.user.role === 'admin'
  return (
    <>
      <Routes>
        <Route path='/*' element = {isAdmin ? <Navigate to="dashboard"/> : <Frontend/>}></Route>
        <Route path='auth/*' element = {!state.isAuthenticated ? <Auth /> : <Navigate to='/' />} ></Route>
        <Route path='dashboard/*' element={<PrivateRoutes allowedRoles={['admin']} Component={DashBoard}/>}></Route>
        <Route path='todo/*' element = {<Todo/>}></Route>
      </Routes>
    </>
  )
}
