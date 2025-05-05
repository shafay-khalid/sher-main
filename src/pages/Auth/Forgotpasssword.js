import { message } from 'antd'
import React, { useState } from 'react'
import {Link} from 'react-router-dom'

export default function Forgotpasssword() {
const [state , setState] = useState({ email: "", password: "" , confirmPassword: ""})
const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))
const handleForgotPassword = e => {
  e.preventDefault()
  let {email,password,confirmPassword} = state
  if(password.length < 8){return message.error("Password Must Be Of Eight Character")}
  let users = JSON.parse(localStorage.getItem('users')) || []
  let userExist = users.find(user => user.email === email)
  if(userExist){
    if(password === confirmPassword){
      users = users.map(user => user.email === email ? { ...user, password: confirmPassword} : user);
      // users.push(users);
      localStorage.setItem('users', JSON.stringify(users));
      message.success("New Password is Updated")
    }else{return message.error("Enter The Same Password In Both Field")}
  }else{
   return message.error("Email Not Found")
  }

}

  return (
    <main className='auth py-5'>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="card border-none mx-auto p-3 p-md-4" style={{ maxWidth: 400 }}>
              <h2 className='text-primary mb-4 text-center'>ForGot Password</h2>
              <form onSubmit={handleForgotPassword}>
              <div className="col-12 mb-4">
                    <input type="email" className='form-control' onChange={handleChange} placeholder='Enter Email' name='email' />
                  </div>
                  <div className="col-12 mb-4">
                    <input type="password" className='form-control' onChange={handleChange} placeholder='Enter password' name='password' />
                  </div>
                  <div className="col-12 mb-4">
                    <input type="password" className='form-control' onChange={handleChange} placeholder='Confirm password' name='confirmPassword' />
                  </div>
                  <button className='btn btn-primary w-100'>Update Password</button>
                  <p className='mb-0 mt-1'><Link to='/auth/login'>Login Again</Link></p>
                  {/* <Link to='/auth/login'>Login Again</Link> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
