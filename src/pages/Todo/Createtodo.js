import { message } from 'antd';
import React, {useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Createtodos() {
  const [state, setState] = useState({ image: "", productName: '', description: '', price: '' })
  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))
  const navigate = useNavigate();
  const moveHome = e => {
    e.preventDefault();
    navigate('/todo/todos')
  }
  // const inputRef = useRef(null)
  // const [image, setImage] = useState("");
  // const handleImageClick = e => {
  //   inputRef.current.click();
  // }
  // const handleImage = e => {
  //   const file = e.target.files[0];
  //   console.log(file);
  //   setImage(e.target.files[0])
  //   let end = URL.createObjectURL(image)
  //   console.log(end)
    
  // }
  const handleSubmit = e => {
    e.preventDefault();
    // const {image , productName , description , price} = state;
    const todo = state
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push(todo)
    localStorage.setItem('todos', JSON.stringify(todos));
    message.success('Todo is Created Successfully')
    navigate('/todo/todos')
  }
  return (
    <main className='auth py-5'>
      <div className="container ">
        <div className="row">
          <div className="col">
            < div className="card border-none mx-auto p-3 p-md-4" style={{ maxWidth: 800 }}>
              <h2 className='text-primary text-center mb-4'>Create Todo</h2>
              <form >
                <div className="row">
                  <div className="col-12 col-lg-6 mb-4">
                    <input type="text" className='form-control' onChange={handleChange} required  placeholder='Enter Product Name' name='productName' />
                  </div>
                  <div className="col-12 col-lg-6 mb-4">
                    <input type="text" className='form-control' onChange={handleChange} required placeholder='Enter Product Description' name='description' />
                  </div>
                  <div className="col-12 text-center">
                    <input type="number" className='form-control' onChange={handleChange} required placeholder='Enter Product Price' name='price' />
                  </div>
                  <div className='text-center m-3'>
                    <input type="file"   name='image' />
                  </div>
                  {/* <div onClick={handleImageClick}>
                  <img src={image} alt="Your Image" />
                  <input type="file" ref={inputRef} onChange={handleImage}   />
                  </div> */}
                  <div className='text-center'>
                    <button className='btn btn-info mx-3' onClick={moveHome} style={{ width: 150 }}><b>Back</b></button>
                    <button className='btn btn-info mx-3' onClick={handleSubmit} style={{ width: 150 }}><b>Create Todo</b></button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
