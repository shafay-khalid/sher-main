import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Todos() {
    const navigate = useNavigate();
    const moveHome = e => {
        e.preventDefault();
        navigate("/")
    }
    const createtodo = e => {
        e.preventDefault();
        navigate('/todo/createtodo')
    }
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    const generateTableRows = () => {
        return todos.map((todo, i) => (
            <tr key={i}>
                <th scope="row">{i + 1}</th>
                <td>{todo.image}</td>
                <td>{todo.productName}</td>
                <td>{todo.description}</td>
                <td>{todo.price}</td>
            </tr>
        ));
    };
    const table = (
        <div className="table-responsive">
            <table className="table table-light border-info">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Image</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {generateTableRows()}
                </tbody>
            </table>
        </div>
    );
    return (
        <main className='auth py-5'>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="card p-3">
                            <h2 className='text-center '> TODOS Form</h2>
                            {table}
                            <div className='text-center'>
                                <button className='btn btn-info mx-3' onClick={moveHome} style={{ width: 150 }}><b>Back</b></button>
                                <button className='btn btn-info mx-3' onClick={createtodo} style={{ width: 150 }}><b>Create Todo</b></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}