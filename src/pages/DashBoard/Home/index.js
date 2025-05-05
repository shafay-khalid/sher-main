import React, { useState, useEffect } from 'react';
import { Card, Col, Image, Row, Typography, Spin, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';

const { Title, Paragraph } = Typography;

export default function Home({ searchQuery = '' }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = 'https://distinct-seana-shafay-khalid-fc93f8ee.koyeb.app'

  const getData = async () => {
    try {
      const response = await axios.get(`${api}/getItems`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching menu items: ", error);
      message.error("Something went wrong while fetching menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredData = data.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      (item.name && typeof item.name === 'string' && item.name.toLowerCase().includes(query)) ||
      (item.categories.some(category => category.toLowerCase().includes(query)))
    );
  });

  return (
    <main>
      <Spin spinning={loading} size='large'>
        <div className='text-center p-5'>
          <Title level={2}>Menu</Title>
          <Row gutter={[16, 16]} className='justify-content-center'>
            {filteredData.map((item) => (
              <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  className='text-start'
                  bordered={true}
                  style={{ maxWidth: "350px ", maxHeight: "400px", borderRadius: "10px" }}
                  cover={
                    item.imageUrls && item.imageUrls.length > 0 ? (
                      <Image
                        src={`${api}${item.imageUrls[0]}`}
                        alt={item.name}
                        preview={false}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{ height: "200px", backgroundColor: "#f0f0f0", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Typography.Text>No Image Available</Typography.Text>
                      </div>
                    )
                  }
                  title={
                    <div className='d-flex justify-content-between align-items-center'>
                      <h3>{item.name}</h3>
                      <p className='text-danger'>Rs. {item.sellingPrice}</p>
                    </div>
                  }
                >
                  <Link to={`/item/${item._id}`}>{item.name}</Link>
                  <Paragraph ellipsis={{ rows: 3 }}>{item.description}</Paragraph>
                  <p>Category: {item.categories.join(', ')}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Spin>
    </main>
  );
}
