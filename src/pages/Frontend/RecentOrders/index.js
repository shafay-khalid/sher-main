import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Row, Col, message } from 'antd';
import { useAuth } from '../../../context/authContext';
import bg from "../../../assets/images/bg3.jpg"; // Import your background image

export default function RecentOrders() {
    const { state } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const api = 'https://distinct-seana-shafay-khalid-fc93f8ee.koyeb.app'

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${api}/getOrders`);
                // Filter orders based on the current user's UID
                const userOrders = response.data.filter(order => order.userId === state.user.uid);
                setOrders(userOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
                message.error("Failed to fetch orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [state.user.uid]);

    const handleRemoveOrder = async (orderId) => {
        try {
            await axios.delete(`${api}/deleteOrder/${orderId}`);
            message.success("Order removed successfully!");
            // Update the orders state to remove the canceled order
            setOrders(orders.filter(order => order._id !== orderId));
        } catch (error) {
            console.error("Error removing order: ", error.message);
            message.error("Failed to remove order!");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <Row gutter={16}>
                <Col span={24}>
                    <h1 style={{ textAlign: 'center', color: '#fff' }}>Recent Orders</h1>
                </Col>
                {orders.length === 0 ? (
                    <Col span={24}>
                        <p style={{ textAlign: 'center', color: '#fff' }}>No orders found.</p>
                    </Col>
                ) : (
                    orders.map(order => (
                        <Col xs={24} sm={12} md={8} key={order._id} style={{ marginBottom: '20px' }}>
                            <Card style={styles.card}>
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index} style={styles.itemList}>
                                            <img src={`${api}${item.itemId.imageUrls[0]}`} alt={item.itemId.name} style={styles.itemImage} />
                                            <span>
                                                {item.itemId.name} Color: {item.selectedColor}  Quantity: {item.quantity}<br />
                                                <span>RS {item.totalPrice.toFixed(2)}</span>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <Button type="primary" danger onClick={() => handleRemoveOrder(order._id)}>
                                    Cancel Order
                                </Button>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </div>
    );
}

const styles = {
    container: {
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px',
        marginTop: "70px",
        minHeight: '100vh',
        color: '#fff',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background for the card
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    },
    itemList: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
    },
    itemImage: {
        width: '70px', // Increased width for the item image
        height: '70px', // Increased height for the item image
        borderRadius: '5px',
        marginRight: '10px', // Space between image and text
    },
};