import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Typography, Row, Col, Card } from 'antd';
import axios from 'axios';
import bg from "../../../assets/images/bg3.jpg"; // Background image

const { Title } = Typography;

const CategoryPage = () => {
    const { categoryName } = useParams(); // Get the category name from the URL
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const api = 'https://distinct-seana-shafay-khalid-fc93f8ee.koyeb.app'

    useEffect(() => {
        const fetchCategoryItems = async () => {
            try {
                const response = await axios.get(`${api}/getItemsByCategory/${categoryName}`); // Call the correct endpoint
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching category items:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategoryItems();
    }, [categoryName]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.categoryPage}>
            <Title level={2} style={{ color: '#fff' }}>{categoryName}</Title>
            <Row gutter={16} style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {items.map(item => (
                    <Col key={item._id} xs={24} sm={12} md={8}>
                        <Link to={`/item/${item._id}`} style={{ textDecoration: 'none' }}>
                            <Card style={styles.card}>
                                <img src={`${api}${item.imageUrls[0]}`} alt={item.name} style={styles.itemImage} />
                                <div style={styles.itemNameContainer}>
                                    <Title level={4} style={{ color: '#000', margin: 0 }}>{item.name}</Title>
                                </div>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

const styles = {
    categoryPage: {
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
};

export default CategoryPage;