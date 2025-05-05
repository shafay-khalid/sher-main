import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useAuth } from '../../../context/authContext';
import bg from "../../../assets/images/bg3.jpg"; // Import your background image
import { Button, Card, Col, Row, Input, message, Typography } from 'antd';
import { CopyOutlined } from '@ant-design/icons'; // Import the copy icon
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Checkout = () => {
    const { state } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [isProcessingOrder, setIsProcessingOrder] = useState(false); // Loading state for checkout
    const navigate = useNavigate();
    const api = 'https://distinct-seana-shafay-khalid-fc93f8ee.koyeb.app';
    
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        phone: '',
    });

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`${api}/getCartItems/${state.user.uid}`);
                setCartItems(response.data);
            } catch (error) {
                console.error("Error fetching cart items:", error);
                message.error("Failed to fetch cart items");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCartItems();
    }, [state.user.uid]);

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + (item.totalPrice * item.quantity), 0).toFixed(2);
    };

    const validateForm = () => {
        let newErrors = {};
        if (!userDetails.firstName) newErrors.firstName = "First name is required";
        if (!userDetails.lastName) newErrors.lastName = "Last name is required";
        if (!userDetails.address) newErrors.address = "Address is required";
        if (!userDetails.city) newErrors.city = "City is required";
        if (!userDetails.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!/^03\d{9}$/.test(userDetails.phone)) {
            newErrors.phone = "Enter a valid Pakistani phone number (e.g., 03001234567)";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCheckout = async () => {
        if (!validateForm()) return;

        const orderData = {
            userId: state.user.uid,
            items: cartItems,
            userDetails,
        };

        setIsProcessingOrder(true); // Set loading state to true
        try {
            await axios.post(`${api}/storeOrder`, orderData);
            message.success("Order placed successfully!");
            // Clear input fields
            setUserDetails({
                firstName: '',
                lastName: '',
                address: '',
                city: '',
                postalCode: '',
                phone: '',
            });
            // Navigate to home page
            navigate('/');
        } catch (error) {
            console.error("Error placing order:", error);
            message.error("Failed to place order");
        } finally {
            setIsProcessingOrder(false); // Reset loading state
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            message.success("Copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy: ", err);
            message.error("Failed to copy to clipboard");
        });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.checkoutPage}>
            <Row gutter={16}>
                {/* Order Summary */}
                <Col xs={24} md={8}>
                    <Card title="Order Summary" style={styles.card}>
                        {cartItems.map(item => (
                            <div key={item._id}>
                                <h5>{item.itemId.name} ({item.selectedColor})</h5>
                                <p>Price: RS {(item.totalPrice * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                        <h4>Total: RS {calculateTotal()}</h4>
                    </Card>
                </Col>
                
                {/* Payment Information */}
                <Col xs={24} md={8}>
                    <Card title="Payment Information" style={styles.card}>
                        <p><strong>Cash on Delivery (COD)</strong></p>
                        <p>To confirm your order, make an advance payment of 250 rupees for delivery charges.</p>
                        <p>Make sure to send the screen shot of the payment to this number 03228805282.</p>
                        <p><strong>Name:</strong> Muhammad Shafay</p>
                        <p>
                            <strong>Number:</strong> 
                            <span onClick={() => copyToClipboard("03228805282")} style={styles.copyableText}>
                               <b> 03228805282<CopyOutlined style={styles.copyIcon} /> </b>
                            </span>
                        </p>
                        <p><strong>Account:</strong> Jazzcash/Easypaisa</p>
                        <p><strong>Bank:</strong> Alfalah</p>
                        <p>
                            <strong>Account no:</strong> 
                            <span onClick={() => copyToClipboard("59035002160962")} style={styles.copyableText}>
                               <b> 59035002160962 <CopyOutlined style={styles.copyIcon} /> </b>
                            </span>
                        </p>
                        <p>
                            <strong>IBAN:</strong> 
                            <span onClick={() => copyToClipboard("PK42ALFH5903005002160962")} style={styles.copyableText}>
                               <b> PK42ALFH5903005002160962 <CopyOutlined style={styles.copyIcon} /> </b>
                            </span>
                        </p>
                    </Card>
                </Col>

                {/* Delivery Details */}
                <Col xs={24} md={8}>
                    <Card title="Delivery Details" style={styles.card}>
                        <Input placeholder="First Name" style={styles.inputField} onChange={(e) => setUserDetails({ ...userDetails, firstName: e.target.value })} />
                        {errors.firstName && <p style={styles.errorText}>{errors.firstName}</p>}
                        
                        <Input placeholder="Last Name" style={styles.inputField} onChange={(e) => setUserDetails({ ...userDetails, lastName: e.target.value })} />
                        {errors.lastName && <p style={styles.errorText}>{errors.lastName}</p>}
                        
                        <Input placeholder="Address" style={styles.inputField} onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })} />
                        {errors.address && <p style={styles.errorText}>{errors.address}</p>}
                        
                        <Input placeholder="City" style={styles.inputField} onChange={(e) => setUserDetails({ ...userDetails, city: e.target.value })} />
                        {errors.city && <p style={styles.errorText}>{errors.city}</p>}
                        
                        <Input placeholder="Postal Code" style={styles.inputField} onChange={(e) => setUserDetails({ ...userDetails, postalCode: e.target.value })} />
                        
                        <Input placeholder="Phone" style={styles.inputField} onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })} />
                        {errors.phone && <p style={styles.errorText}>{errors.phone}</p>}
                        
                        <Button 
                            type="primary" 
                            style={styles.checkoutButton} 
                            onClick={handleCheckout} 
                            loading={isProcessingOrder} // Show loading state
                            disabled={calculateTotal() === "0.00" || cartItems.length === 0} // Disable if total is 0 or no items
                        >
                            Complete Order
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

const styles = {
    checkoutPage: { backgroundImage: `url(${bg})`, padding: '20px', marginTop: '70px', minHeight: '100vh' },
    card: { backgroundColor: 'rgba(255, 255, 255, 0.8)', marginBottom: '20px' },
    checkoutButton: { backgroundColor: '#16a34a', color: 'white', marginTop: '20px' },
    inputField: { marginBottom: '10px' },
    errorText: { color: 'red', fontSize: '12px' },
    copyableText: { cursor: 'pointer' }, // Style for copyable text
    copyIcon: { marginLeft: '5px', cursor: 'pointer' }, // Style for the copy icon
};

export default Checkout;