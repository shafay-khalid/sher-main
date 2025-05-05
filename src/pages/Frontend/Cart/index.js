import React, { useEffect, useState } from "react";
import { useAuth } from '../../../context/authContext'; // Assuming you have an auth context
import axios from 'axios';
import { Card, Button, Typography, Row, Col, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'; // Import the delete icon
import bg from "../../../assets/images/bg3.jpg"; // Import your background image
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const CartPage = () => {
  const { state } = useAuth(); // Get user state from auth context
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const api = 'https://distinct-seana-shafay-khalid-fc93f8ee.koyeb.app'

  const handleCheckout = () => {
    setIsProcessingOrder(true);
    navigate("/checkout"); // Navigate to the checkout page
    setIsProcessingOrder(false); // Reset loading state  
  };

  useEffect(() => {
    if (!state.isAuthenticated) {
      message.warning("You need to log in to view your cart.");
      navigate('/auth/login');
      return;
    }
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${api}/getCartItems/${state.user.uid}`);
        setCartItems(response.data);
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setError("Failed to fetch cart items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [state.isAuthenticated, state.user.uid, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.totalPrice * item.quantity), 0).toFixed(2);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      await axios.put(`${api}/updateCartItem/${itemId}`, { quantity: newQuantity });
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      message.success("Quantity updated successfully!");
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error("Failed to update quantity");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`${api}/removeFromCart/${itemId}`);
      setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
      message.success("Item removed from cart successfully!");
    } catch (error) {
      console.error("Error removing item:", error);
      message.error("Failed to remove item from cart");
    }
  };

  return (
    <div style={styles.cartPage}>
      <Title style={{ textAlign: "center", color: "#fff" }}>Your Cart ({cartItems.length} items)</Title>
      <Row gutter={16} style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {cartItems.map(item => (
          <Col key={item._id} xs={24} sm={12} md={8}>
            <Card style={styles.card}>
              <img src={`${api}${item.imageUrl}`} alt={item.itemId.name} style={styles.itemImage} />
              <Title level={4}>{item.itemId.name}</Title>
              <Text>Color: {item.selectedColor}</Text>
              <div style={styles.quantityContainer}>
                <Button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}>-</Button>
                <Text style={{ margin: '0 10px' }}>{item.quantity}</Text>
                <Button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</Button>
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => removeItem(item._id)}
                  style={{ marginLeft: '10px', color: 'red' }}
                />
              </div>
              <Text strong style={styles.price}>Total: RS {(item.totalPrice * item.quantity).toFixed(2)}</Text>
            </Card>
          </Col>
        ))}
      </Row>
      <div style={styles.totalContainer}>
        <Text style={{ fontSize: "18px", color: "#fff" }}>Grand Total: RS {calculateTotal()}</Text><br />
        <Button type="primary" loading={isProcessingOrder} style={styles.checkoutButton} onClick={handleCheckout} disabled={calculateTotal() === "0.00" || cartItems.length === 0}>Check out</Button>
      </div>
    </div>
  );
};

const styles = {
  cartPage: {
    position: 'relative',
    minHeight: '100vh',
    backgroundImage: `url(${bg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    padding: '20px',
    color: '#fff',
  },
  card: {
    margin: '10px',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background for the card
  },
  itemImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
  },
  quantityContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '10px 0',
  },
  price: {
    fontSize: '18px',
    color: '#16a34a',
  },
  totalContainer: {
    marginTop: '20px',
    textAlign: 'right',
  },
  checkoutButton: {
    padding: '10px 20px',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
};

export default CartPage;