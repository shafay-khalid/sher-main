import React, { useEffect, useState } from 'react';
import { Button, Typography, message, Row, Col, Card } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'; // Import the dustbin icon
import axios from 'axios';
import { useAuth } from '../../../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import bg from "../../../assets/images/bg3.jpg"; // Import your background image

const { Title } = Typography;

const Wishlist = () => {
    const { state } = useAuth();
    const navigate = useNavigate();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const api = 'https://distinct-seana-shafay-khalid-fc93f8ee.koyeb.app'

    useEffect(() => {
        if (!state.isAuthenticated) {
            message.warning("You need to log in to view your wishlist.");
            navigate('/auth/login');
            return;
        }

        const fetchWishlistItems = async () => {
            try {
                const response = await axios.get(`${api}/getWishlistItems/${state.user.uid}`);
                setWishlistItems(response.data);
            } catch (error) {
                console.error("Error fetching wishlist items:", error);
                message.error("Failed to fetch wishlist items");
            } finally {
                setIsLoading(false);
            }
        };

        fetchWishlistItems();
    }, [state.isAuthenticated, state.user.uid, navigate]);

    const removeFromWishlist = async (itemId) => {
        try {
            await axios.delete(`${api}/removeFromWishlist/${itemId}`);
            setWishlistItems(wishlistItems.filter(item => item.itemId && item.itemId._id !== itemId)); // Ensure you're checking against the correct ID
            message.success("Item removed from wishlist successfully!");
        } catch (error) {
            console.error("Error removing item from wishlist:", error);
            message.error("Failed to remove item from wishlist");
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.wishlistPage}>
            <Title level={2} style={{ color: '#fff' }}>Your Wishlist</Title>
            {wishlistItems.length === 0 ? ( // Check if wishlist is empty
                <div style={styles.emptyMessage}>
                    <Title level={4} style={{ color: '#fff' }}>You have not added any items to your favorites.</Title>
                </div>
            ) : (
                <Row gutter={16} style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    {wishlistItems.map(item => (
                        item.itemId ? ( // Check if itemId exists
                            <Col key={item._id} xs={24} sm={12} md={8}>
                                <Card style={styles.card}>
                                    <Link to={`/item/${item.itemId._id}`} style={{ textDecoration: 'none' }}>
                                        <img src={`${api}${item.itemId.imageUrls[0]}`} alt={item.itemId.name} style={styles.itemImage} />
                                    </Link>
                                    <div style={styles.itemNameContainer}>
                                        <Title level={4} style={{ color: '#000', margin: 0 }}>{item.itemId.name}</Title>
                                        <Button
                                            type="text"
                                            icon={<DeleteOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent card click event
                                                removeFromWishlist(item.itemId._id); // Ensure you're passing the correct ID
                                            }}
                                            style={{ color: 'red', marginLeft: '10px' }} // Add margin for spacing
                                        />
                                    </div>
                                </Card>
                            </Col>
                        ) : null // Render nothing if itemId is not present
                    ))}
                </Row>
            )}
        </div>
    );
};

const styles = {
    wishlistPage: {
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
        margin: '20px',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background for the card
        cursor: 'pointer', // Change cursor to pointer for card
    },
    itemImage: {
        width: '100%',
        height: 'auto',
        borderRadius: '8px',
    },
    itemNameContainer: {
        display: 'flex',
        alignItems: 'center', // Align items vertically
        justifyContent: 'space-between', // Space between name and icon
        marginTop: '10px', // Space above the name
    },
    emptyMessage: {
        textAlign: 'center',
        marginTop: '50px',
    },
};

export default Wishlist;