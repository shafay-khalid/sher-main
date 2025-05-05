import React, { useState } from 'react';
import { Col, Form, Input, Row, Button, Typography, Upload, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;
const api = 'https://distinct-seana-shafay-khalid-fc93f8ee.koyeb.app/'

const initialItemState = { 
    name: "", 
    buyPrice: "", 
    sellingPrice: "", 
    discount: "", 
    showingNumber: "", 
    categories: [], 
    description: "", // Add description to the initial state
    images: [] 
};

// Define the categories you want to allow
const availableCategories = [
    "clutches",
    "shoulderbags",
    "eveningbags",
    "totebags",
    "pouch",
    "handbags",
    "crossbody",
    "fannypacks",
    "backpacks",
    'jewellery',
    'dress'
];

export default function AddItems() {
    const [itemState, setItemState] = useState(initialItemState);
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [colors, setColors] = useState([""]); // Array to hold colors for each image

    const handleChange = e => {
        setItemState(s => ({ ...s, [e.target.name]: e.target.value }));
    };

    const handleCategoryChange = value => {
        setItemState(s => ({ ...s, categories: value }));
    };

    const handleFileChange = ({ fileList }) => {
        setFiles(fileList);
    };

    const handleColorChange = (index, value) => {
        const newColors = [...colors];
        newColors[index] = value;
        setColors(newColors);
    };

    const handleSubmitItem = async (e) => {
        e.preventDefault();
        const { name, buyPrice, sellingPrice, discount, showingNumber, categories, description } = itemState;
    
        if (name.length < 3) return message.error("Please enter a proper item name");
        if (categories.length === 0) return message.error("Please select at least one category");
        if (buyPrice <= 0) return message.error("Please enter a valid buy price");
        if (sellingPrice <= 0) return message.error("Please enter a valid selling price");
    
        const id = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        let imageUrls = [];
    
        // Upload images to the backend
        if (files.length > 0) {
            setIsLoading(true);
            try {
                const formData = new FormData();
                files.forEach(file => {
                    formData.append('images', file.originFileObj);
                });
    
                const response = await axios.post(`${api}uploadImages`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
                imageUrls = response.data.imageUrls; // Assuming your backend returns the URLs of the uploaded images
            } catch (error) {
                console.error("Image upload error:", error);
                message.error("Failed to upload images");
                setIsLoading(false);
                return;
            }
        }
    
        const formData = { 
            name, 
            buyPrice, 
            sellingPrice, 
            discount, 
            showingNumber, 
            categories, 
            id, 
            imageUrls, 
            colors: colors.length ? colors : [""] , // Set colors to an array with an empty string if no colors are provided
            description // Include description in the form data
        };
        // console.log(formData);
        setIsLoading(true);
        try {
            await axios.post(`${api}storeItem`, formData);
            message.success("Item added successfully");
            setItemState(initialItemState);
            setFiles([]);
            setColors([""]); // Reset colors
        } catch (error) {
            console.error(error);
            message.error("Something went wrong while adding the item");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className='d-flex justify-content-center align-items-center w-100 min-v h-100'>
                <Form layout='vertical' className='border border-2 p-5 bg-white' style={{ maxWidth: '700px', width: '100%' }}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Title level={2} style={{ textAlign: 'center' }}>Add Item</Title>
                        </Col>
                        <Col span={24}>
                            <Input type='text' placeholder='Product Name' name='name' onChange={handleChange} value={itemState.name} />
                        </Col>
                        <Col span={24}>
                            <Input type='number' placeholder='Buy Price' name='buyPrice' onChange={handleChange} value={itemState.buyPrice} />
                        </Col>
                        <Col span={24}>
                            <Input type='number' placeholder='Selling Price' name='sellingPrice' onChange={handleChange} value={itemState.sellingPrice} />
                        </Col>
                        <Col span={24}>
                            <Input type='number' placeholder='Discount Percentage' name='discount' onChange={handleChange} value={itemState.discount} />
                        </Col>
                        <Col span={24}>
                            <Input type='number' placeholder='Showing Number' name='showingNumber' onChange={handleChange} value={itemState.showingNumber} />
                        </Col>
                        <Col span={24}>
                            <Input.TextArea 
                                placeholder='Description' 
                                name='description' 
                                onChange={handleChange} 
                                value={itemState.description} 
                                rows={4} 
                            />
                        </Col>
                        <Col span={24}>
                            <Select
                                mode="multiple"
                                placeholder="Select Categories"
                                style={{ width: '100%' }}
                                onChange={handleCategoryChange}
                                value={itemState.categories}
                            >
                                {availableCategories.map(category => (
                                    <Option key={category} value={category}>{category}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={24}>
                            <Upload
                                onChange={handleFileChange}
                                showUploadList={{ showPreviewIcon: false }}
                                multiple
                            >
                                <Button icon={<UploadOutlined />}>Click to Upload Images</Button>
                            </Upload>
                        </Col>
                        {files.map((file, index) => (
                            <Col span={24} key={index}>
                                <Input
                                    type='text'
                                    placeholder='Color for this image'
                                    value={colors[index]}
                                    onChange={(e) => handleColorChange(index, e.target.value)}
                                />
                            </Col>
                        ))}
                        <Col span={24}>
                            <Button type='primary' block htmlType='submit' loading={isLoading} onClick={handleSubmitItem}>Add Item</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    );
}