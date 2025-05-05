import React, { useState } from 'react';
import { HomeOutlined, PlusOutlined, LogoutOutlined, MenuOutlined, RetweetOutlined, FileDoneOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Modal, Drawer, Input } from 'antd';
import Routes from "./Routes";
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useAuth } from '../../context/authContext';

const { Content, Sider, Header, Footer } = Layout;

function getItem(label, key, icon, onClick, children) {
    return { key, icon, label, onClick, children };
}
export default function DashBoard() {
    const [collapsed, setCollapsed] = useState(true);
    const { logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const isSmallScreen = useMediaQuery({ query: '(max-width: 820px)' });

    const showModal = () => { setIsModalOpen(true) };
    const handleCancel = () => { setIsModalOpen(false) };

    const handleLogout = () => {
        logout();
        setIsModalOpen(false);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    const items = [
        getItem(<Link to="/" style={{ textDecoration: "none" }} onClick={closeDrawer}>Home</Link>, '1', <HomeOutlined />),
        getItem(<Link to="recent-orders" style={{ textDecoration: "none" }} onClick={closeDrawer}>Recent Orders</Link>, '2', <FileDoneOutlined />),
        getItem(<Link to="users" style={{ textDecoration: "none" }} onClick={closeDrawer}>Users</Link>, '3', <UserOutlined />),
        getItem(<Link to="update-items" style={{ textDecoration: "none" }} onClick={closeDrawer}>Update Items</Link>, '4', <RetweetOutlined />),
        getItem(<Link to="add-items" style={{ textDecoration: "none" }} onClick={closeDrawer}>Add Item</Link>, '5', <PlusOutlined />),
        getItem(<Link to="table-orders" style={{ textDecoration: "none" }} onClick={closeDrawer}>Table Orders</Link>, '6', <FileDoneOutlined />),
        getItem(<span onClick={() => { showModal(); closeDrawer(); }}>Logout</span>, '7', <LogoutOutlined onClick={() => { showModal(); closeDrawer(); }} />),
    ];
    const renderMenu = () => (
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
    );

    return (
        <>
            <Layout>
                {isSmallScreen ? (
                    <>
                        <div style={{ position: 'absolute', top: 16, left: 10, zIndex: 1000 }}>
                            <Button type="primary" icon={<MenuOutlined />} onClick={() => setDrawerVisible(true)}></Button>
                        </div>
                        <Drawer title="Sharki Brand" placement="left" onClose={() => setDrawerVisible(false)} open={drawerVisible} style={{ backgroundColor: '#001529', color: '#fff' }}>
                            {renderMenu()}
                        </Drawer>
                    </>
                ) : (
                    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                        <div className="dashboard-sider" />
                        {renderMenu()}
                    </Sider>
                )}
                <Layout>
                    <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#001529' }}>
                        <h2 style={{ margin: 0 }} className='text-white'>Sharki Brand</h2>
                        <Input.Search placeholder="Search by name/category" style={{ maxWidth: '250px' }} onSearch={(value) => setSearchQuery(value)} allowClear />
                    </Header>
                    <Content>
                        <Routes searchQuery={searchQuery} />
                    </Content>
                    <Footer style={{ textAlign: 'center', background: "#001529", color: "#fff", padding: "0" }} >
                        © {new Date().getFullYear()}. All Rights Reserved.
                    </Footer>
                </Layout>
            </Layout>

            {/* Logout Modal */}
            <Modal title="Logout Confirmation" open={isModalOpen} onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
                    <Button key="logout" type='primary' danger onClick={handleLogout}>Logout</Button>
                ]}
            >
                <p>Are you sure you want to logout?</p>
            </Modal>
        </>
    );
}
