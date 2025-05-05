import React from 'react'
import { Table } from 'antd'
import { useNavigate } from 'react-router-dom';

export default function Registered() {
    const navigate = useNavigate()
    const moveHome = e => {
        navigate('/')
    }
    const moveLogin = e => {
        navigate('/auth/register')
    }
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const generateTableRows = () => {
        return users.map((user, i) => (
            <tr key={i}>
                <th scope="row">{i + 1}</th>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
            </tr>
        ));
    };

    const table = (
        <div className="table-responsive">
            <table className="table table-light border-info">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Password</th>
                    </tr>
                </thead>
                <tbody>
                    {generateTableRows()}
                </tbody>
            </table>
        </div>
    );
    return (
        <>

            <main className='auth py-5'>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="card p-3 ">
                                <h1 className='text-info text-center'>Registered Users</h1>
                                {table}
                                <p className='text-center'>
                                    <button className='btn btn-info mx-3' onClick={moveHome} style={{ width: 150 }}><b>Back</b></button>
                                    <button className='btn btn-info mx-3' onClick={moveLogin} style={{ width: 150 }}><b>Add New User</b></button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </>
    )
}
