import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Input, message, Modal, Table, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const initialState = {
    updatedName: "",
    updatedBuyPrice: "",
    updatedSellingPrice: "",
    updatedDiscount: "",
    updatedShowingNumber: "",
    updatedCategories: [],
};

export default function Update() {
    const [state, setState] = useState(initialState);
    const [data, setData] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const api = 'https://distinct-seana-shafay-khalid-fc93f8ee.koyeb.app'

    const showModal = (item) => {
        setCurrentItem(item);
        setState({
            updatedName: item.name,
            updatedBuyPrice: item.buyPrice,
            updatedSellingPrice: item.sellingPrice,
            updatedDiscount: item.discount,
            updatedShowingNumber: item.showingNumber,
            updatedCategories: item.categories,
        });
        setIsModalOpen(true);
    };

    const handleOk = () => {
        updateItem(currentItem._id);
        setIsModalOpen(false);
    };

    const handleCancel = () => setIsModalOpen(false);

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }));

    const updateItem = async (id) => {
        const { updatedName, updatedBuyPrice, updatedSellingPrice, updatedDiscount, updatedShowingNumber, updatedCategories } = state;

        const formData = {
            name: updatedName,
            buyPrice: updatedBuyPrice,
            sellingPrice: updatedSellingPrice,
            discount: updatedDiscount,
            showingNumber: updatedShowingNumber,
            categories: updatedCategories,
        };

        try {
            await axios.put(`${api}/updateItem/${id}`, formData);
            setData(data.map(item => (item._id === id ? { ...item, ...formData } : item)));
            message.success("Item updated successfully");
        } catch (error) {
            console.error(error);
            message.error("Failed to update the item.");
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`${api}/deleteItem/${id}`);
            setData(data.filter(item => item._id !== id));
            message.success("Item deleted successfully");
            setIsModalOpen(false); // Close the modal after deletion
        } catch (error) {
            console.error(error);
            message.error("Failed to delete the item.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${api}/getItems`);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching items:", error);
                message.error("Failed to fetch items");
            }
        };

        fetchData();
    }, []);

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Buy Price', dataIndex: 'buyPrice', key: 'buyPrice' },
        { title: 'Selling Price', dataIndex: 'sellingPrice', key: 'sellingPrice' },
        { title: 'Discount', dataIndex: 'discount', key: 'discount' },
        { title: 'Showing Number', dataIndex: 'showingNumber', key: 'showingNumber' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button type="primary" onClick={() => showModal(record)}>Update</Button>
            )
        }
    ];

    return (
        <>
            <Card style={{ overflowY: "auto", maxHeight: "80vh" }}>
                <Table columns={columns} dataSource={data} pagination={false} />
            </Card>

            <Modal title="Update Item" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form layout="vertical">
                    <Input
                        placeholder="Name"
                        name="updatedName"
                        value={state.updatedName}
                        onChange={handleChange}
                    />
                    <Input
                        placeholder="Buy Price"
                        name="updatedBuyPrice"
                        type="number"
                        value={state.updatedBuyPrice}
                        onChange={handleChange}
                    />
                    <Input
                        placeholder="Selling Price"
                        name="updatedSellingPrice"
                        type="number"
                        value={state.updatedSellingPrice}
                        onChange={handleChange}
                    />
                    <Input
                        placeholder="Discount Percentage"
                        name="updatedDiscount"
                        type="number"
                        value={state.updatedDiscount}
                        onChange={handleChange}
                    />
                    <Input
                        placeholder="Showing Number"
                        name="updatedShowingNumber"
                        type="number"
                        value={state.updatedShowingNumber}
                        onChange={handleChange}
                    />
                    <Select
                        mode="multiple"
                        placeholder="Select Categories"
                        style={{ width: '100%' }}
                        value={state.updatedCategories}
                        onChange={(value) => setState(s => ({ ...s, updatedCategories: value }))}
                    >
                        <Option value="clutches">Clutches</Option>
                        <Option value="shoulderbags">Shoulder Bags</Option>
                        <Option value="eveningbags">Evening Bags</Option>
                        <Option value="totebags">Tote Bags</Option>
                        <Option value="pouch">Pouch</Option>
                        <Option value="handbags">Handbags</Option>
                        <Option value="crossbody">Crossbody</Option>
                        <Option value="fannypacks">Fanny Packs</Option>
                        <Option value="backpacks">Backpacks</Option>
                        <Option value="jewellery">jewellery</Option>
                        <Option value="dress">dress</Option>
                    </Select>
                </Form>
                <Button type="danger" onClick={() => deleteItem(currentItem._id)}>Delete Item</Button>
            </Modal>
        </>
    );
}