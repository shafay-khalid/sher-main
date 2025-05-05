import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, message, Card, Select } from 'antd';
import { useAuth } from '../../../context/authContext';

const { Option } = Select;

export default function RecentOrders() {
  const { state } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('today'); 
  const api = 'https://distinct-seana-shafay-khalid-fc93f8ee.koyeb.app/'

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${api}getOrders`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        message.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders(); // Fetch once initially
  
    const interval = setInterval(fetchOrders, 5000); // Fetch every 5 seconds
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  

  const filterOrders = (orders, filter) => {
    const now = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      switch (filter) {
        case 'today':
          return orderDate.toDateString() === now.toDateString();
        case 'yesterday':
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          return orderDate.toDateString() === yesterday.toDateString();
        case 'lastWeek':
          const lastWeek = new Date(now);
          lastWeek.setDate(now.getDate() - 7);
          return orderDate >= lastWeek && orderDate <= now;
        case 'lastMonth':
          const lastMonth = new Date(now);
          lastMonth.setMonth(now.getMonth() - 1);
          return orderDate >= lastMonth && orderDate <= now;
        default:
          return true;
      }
    });
  };

  const filteredOrders = filterOrders(orders, filter);

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'userDetails',
      key: 'fullName',
      render: (userDetails) => `${userDetails.firstName} ${userDetails.lastName}`
    },
    {
      title: 'Address',
      dataIndex: 'userDetails',
      key: 'address',
      render: (userDetails) => userDetails.address
    },
    {
      title: 'City',
      dataIndex: 'userDetails',
      key: 'city',
      render: (userDetails) => userDetails.city
    },
    {
      title: 'Phone',
      dataIndex: 'userDetails',
      key: 'phone',
      render: (userDetails) => userDetails.phone
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.itemId.name} x {item.quantity} (Color: {item.selectedColor})
            </li>
          ))}
        </ul>
      )
    },
    {
      title: 'Total',
      dataIndex: 'items',
      key: 'total',
      render: (items) => `RS ${items.reduce((acc, item) => acc + (item.totalPrice * item.quantity), 0).toFixed(2)}`
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => new Date(createdAt).toLocaleString()
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button type="primary" danger onClick={() => handleRemoveOrder(record._id)}>
          Remove
        </Button>
      ),
    },
  ];
  const handleRemoveOrder = async (orderId) => {
    try {
        await axios.delete(`${api}deleteOrder/${orderId}`);
        message.success("Order removed successfully!");
        setOrders(orders.filter(order => order._id !== orderId));
    } catch (error) {
        console.error("Error removing order: ", error.message);
        message.error("Failed to remove order!");
    }
};


  return (
    <main>
      <br /><br /><br /><br />
      <div className="container d-flex flex-column align-items-center justify-content-center">
        <h1>Recent Orders</h1>
        <Select
          defaultValue={filter}
          style={{ width: 200, marginBottom: '20px' }}
          onChange={value => setFilter(value)}
        >
          <Option value="today">Today</Option>
          <Option value="yesterday">Yesterday</Option>
          <Option value="lastWeek">Last Week</Option>
          <Option value="lastMonth">Last Month</Option>
        </Select>
        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <Card style={{ width: '90%', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', overflowY: 'auto', maxHeight: '80vh' }}>
            {filteredOrders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <Table
                className='m-2'
                columns={columns}
                dataSource={filteredOrders}
                pagination={false}
                rowKey="_id"
              />
            )}
          </Card>
        )}
      </div>
    </main>
  );
};
