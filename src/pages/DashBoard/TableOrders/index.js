import React, { useState, useEffect } from 'react';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../../config/firebase';
import { useAuth } from '../../../context/authContext';
import { Table, Button, message, Spin, Select } from 'antd';
// import newOrderAudio from "../../../assets/audio/new_order.mp3"; // Ensure this path is correct

const { Option } = Select;

export default function TableOrders() {
  const { state } = useAuth();
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]); // State for messages
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('orders'); // State to track the selected view
  const [filter, setFilter] = useState('today'); // Default filter for orders
  const [lastOrderCount, setLastOrderCount] = useState(0); // Track the last order count

  // Load audio file
  // const audio = new Audio(newOrderAudio); 

  useEffect(() => {
    const fetchOrders = () => {
      const orderRef = collection(firestore, "tableOrders");
      const unsubscribe = onSnapshot(orderRef, (snapshot) => {
        const orders = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            createdAt: new Date(data.orderDate),
          };
        });
        // Sort orders by createdAt in descending order
        orders.sort((a, b) => b.createdAt - a.createdAt);
        setOrders(orders);
        setLoading(false); // Set loading to false after fetching orders

        // Play audio if new orders are added
        if (orders.length > lastOrderCount) {
          // audio.play().catch(error => {
          //   console.error("Audio playback failed: ", error);
          // });
        }
        setLastOrderCount(orders.length); // Update last order count
      }, (error) => {
        console.error("Error fetching orders: ", error);
        message.error(`Failed to fetch orders: ${error.message}`);
        setLoading(false); // Set loading to false even on error
      });

      return unsubscribe; // Return the unsubscribe function to clean up
    };

    const fetchMessages = () => {
      const messageRef = collection(firestore, "userMessages");
      const unsubscribe = onSnapshot(messageRef, (snapshot) => {
        const messages = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            createdAt: new Date(data.timestamp),
          };
        });
        // Sort messages by createdAt in descending order
        messages.sort((a, b) => b.createdAt - a.createdAt);
        setMessages(messages);
        setLoading(false); // Set loading to false after fetching messages
      }, (error) => {
        console.error("Error fetching messages: ", error);
        message.error(`Failed to fetch messages: ${error.message}`);
        setLoading(false); // Set loading to false even on error
      });

      return unsubscribe; // Return the unsubscribe function to clean up
    };

    // Fetch orders and messages based on the selected view
    if (view === 'orders') {
      const unsubscribe = fetchOrders();
      return () => {
        unsubscribe(); // Clean up the listener on component unmount
      };
    } else if (view === 'messages') {
      const unsubscribe = fetchMessages();
      return () => {
        unsubscribe(); // Clean up the listener on component unmount
      };
    }
  }, [view, lastOrderCount]); // Add view to the dependency array

  const filterOrders = (orders, filter) => {
    const now = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.orderDate);
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
      title: 'User  ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Table Number',
      dataIndex: 'tableNumber',
      key: 'tableNumber',
    },
    {
      title: 'Members',
      dataIndex: 'memberCount',
      key: 'memberCount',
    },
    {
      title: 'Items',
      dataIndex: 'cartItems',
      key: 'cartItems',
      render: (items) => {
        if (Array.isArray(items)) {
          return (
            <ul>
              {items.map((item, index) => (
                <li key={index}>{item.name} x {item.quantity}</li>
              ))}
            </ul>
          );
        } else {
          return <span>No items</span>;
        }
      },
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => {
        return createdAt.toLocaleString();
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button
          type="primary"
          danger
          onClick={() => handleRemoveOrder(record.id)}
        >
          Remove
        </Button>
      ),
    },
  ];

  const handleRemoveOrder = async (orderId) => {
    if (!state.user) {
      console.error("User  is not authenticated");
      return;
    }
    try {
      const orderRef = doc(firestore, "tableOrders", orderId);
      await deleteDoc(orderRef);
      message.success("Order removed successfully!");
    } catch (error) {
      console.error("Error removing order: ", error.message);
      message.error("Failed to remove order!");
    }
  };

  const messageColumns = [
    {
      title: 'User  ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Table Number',
      dataIndex: 'tableNumber',
      key: 'tableNumber',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Timestamp',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => {
        return createdAt.toLocaleString();
      },
    },
  ];

  return (
    <main style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <div className="container d-flex flex-column align-items-center justify-content-center">
        <h1>Admin Dashboard</h1>
        <div style={{ marginBottom: '20px' }}>
          <Button
            type={view === 'orders' ? 'primary' : 'default'}
            onClick={() => setView('orders')}
            style={{
              marginRight: '10px',
              backgroundColor: view === 'orders' ? 'black' : 'transparent',
              color: view === 'orders' ? 'white' : 'black',
              borderColor: 'black'
            }}
          >
            Table Orders
          </Button>
          <Button
            type={view === 'messages' ? 'primary' : 'default'}
            onClick={() => setView('messages')}
            style={{
              backgroundColor: view === 'messages' ? 'black' : 'transparent',
              color: view === 'messages' ? 'white' : 'black',
              borderColor: 'black'
            }}
          >
            Table Messages
          </Button>
        </div>
        {view === 'orders' && (
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
        )}
        {loading ? (
          <Spin tip="Loading..." />
        ) : view === 'orders' ? (
          <div style={{ width: '100%', maxWidth: '1200px' }}>
            {filteredOrders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <Table
                className='m-2'
                columns={columns}
                dataSource={filteredOrders}
                pagination={false}
                scroll={{ x: 'max-content' }}
              />
            )}
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: '1200px' }}>
            {messages.length === 0 ? (
              <p>No messages found.</p>
            ) : (
              <Table
                className='m-2'
                columns={messageColumns}
                dataSource={messages}
                pagination={false}
                scroll={{ x: 'max-content' }}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
};