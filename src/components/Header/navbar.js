import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { useAuth } from '../../context/authContext';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { FaHome, FaCartPlus, FaHeart, FaBox } from 'react-icons/fa';
import logo from '../../assets/images/logo2.png'; // Import your logo image
import axios from 'axios';

export default function CustomNavbar() {
    const { state } = useAuth();
    const navigate = useNavigate();
    const navbarRef = useRef(null);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const doSignOut = () => {
        return auth.signOut();
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch cart item count
    const fetchCartItemCount = async () => {
        if (state.isAuthenticated) {
            try {
                const response = await axios.get(`https://distinct-seana-shafay-khalid-fc93f8ee.koyeb.app/getCartItems/${state.user.uid}`);
                setCartItemCount(response.data.length);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        }
    };

    useEffect(() => {
        // Fetch cart item count immediately on mount
        fetchCartItemCount();

        // Set up interval to fetch cart item count every 2 seconds
        const intervalId = setInterval(fetchCartItemCount, 2000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, [state.isAuthenticated, state.user.uid]); // Dependencies to re-fetch when user state changes

    return (
        <header>
            <Navbar
                ref={navbarRef}
                expand="lg"
                style={{
                    background: 'linear-gradient(135deg, #000000, #16a34a)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    padding: '3px 0',
                    boxShadow: scrolled ? '0 2px 15px rgba(0, 0, 0, 0.08)' : 'none'
                }}
            >
                <Container style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Navbar.Brand
                        as={Link}
                        to="/"
                        style={{
                            fontSize: '24px',
                            fontWeight: '600',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'transform 0.3s ease',
                            padding: '8px 15px',
                            borderRadius: '8px',
                            background: 'transparent',
                            marginRight: 'auto'
                        }}
                    >
                        <img
                            src={logo}
                            alt="Logo"
                            style={{
                                marginRight: '12px',
                                width: '70px',
                                height: '70px',
                            }}
                        />
                        <span
                            style={{
                                color: '#22c55e',
                                background: 'linear-gradient(45deg, #16a34a, #22c55e)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Sharki
                        </span>
                    </Navbar.Brand>

                    <Navbar.Toggle 
                        aria-controls="basic-navbar-nav" 
                        onClick={() => setIsOpen(!isOpen)} 
                    />

                    <Navbar.Collapse id="basic-navbar-nav" in={isOpen}>
                        <Nav className="me-auto" style={{ justifyContent: 'center', flexGrow: 1 }}>
                            <Nav.Link as={Link} to="/" style={{ color: '#ffffff', transition: 'color 0.3s ease, font-size 0.3s ease' }} 
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#e0e0e0'; 
                                    e.currentTarget.style.fontSize = '18px'; 
                                }} 
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#ffffff'; 
                                    e.currentTarget.style.fontSize = '16px'; 
                                }}>
                                <FaHome /> Home
                            </Nav.Link>
                            <Nav.Link as={Link} to="/cart" style={{ color: '#ffffff', transition: 'color 0.3s ease, font-size 0.3s ease' }} 
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#e0e0e0'; 
                                    e.currentTarget.style.fontSize = '18px'; 
                                }} 
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#ffffff'; 
                                    e.currentTarget.style.fontSize = '16px'; 
                                }}>
                                <FaCartPlus /> Cart 
                                {cartItemCount > 0 && (
                                    <Badge pill bg="danger" style={{ marginLeft: '5px' }}>
                                        {cartItemCount}
                                    </Badge>
                                )}
                            </Nav.Link>
                            <Nav.Link as={Link} to="/wishlist" style={{ color: '#ffffff', transition: 'color 0.3s ease, font-size 0.3s ease' }} 
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#e0e0e0'; 
                                    e.currentTarget.style.fontSize = '18px'; 
                                }} 
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#ffffff'; 
                                    e.currentTarget.style.fontSize = '16px'; 
                                }}>
                                <FaHeart /> WishList
                            </Nav.Link>
                            <Nav.Link as={Link} to="/orders" style={{ color: '#ffffff', transition: 'color 0.3s ease, font-size 0.3s ease' }} 
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#e0e0e0'; 
                                    e.currentTarget.style.fontSize = '18px'; 
                                }} 
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#ffffff'; 
                                    e.currentTarget.style.fontSize = '16px'; 
                                }}>
                                <FaBox /> My Orders
                            </Nav.Link>
                        </Nav>

                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                            {state.isAuthenticated ? (
                                <button
                                    onClick={() => {
                                        doSignOut().then(() => {
                                            navigate('/auth/login');
                                        });
                                    }}
                                    className='btn btn-light mx-1' style={{ backgroundColor: 'transparent', border: '1px solid #ffffff', color: '#ffffff', transition: 'background-color 0.3s, color 0.3s, transform 0.3s' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#dc3545'; 
                                        e.currentTarget.style.color = '#ffffff'; 
                                        e.currentTarget.style.transform = 'scale(1.05)'; 
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent'; 
                                        e.currentTarget.style.color = '#ffffff'; 
                                        e.currentTarget.style.transform = 'scale(1)'; 
                                    }}
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <button className='btn btn-light mx-1' style={{ backgroundColor: 'transparent', border: '1px solid #ffffff', color: '#ffffff', transition: 'background-color 0.3s, color 0.3s, transform 0.3s' }}>
                                        <Link className='text-sm text-decoration-none' to={'/auth/login'} 
                                            style={{ color: '#ffffff', transition: 'color 0.3s ease, font-size 0.3s ease' }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = '#e0e0e0'; 
                                                e.currentTarget.style.fontSize = '18px'; 
                                            }} 
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = '#ffffff'; 
                                                e.currentTarget.style.fontSize = '16px'; 
                                            }}>
                                            Login
                                        </Link>
                                    </button>
                                    <button className='btn btn-light mx-1' style={{ backgroundColor: 'transparent', border: '1px solid #ffffff', color: '#ffffff', transition: 'background-color 0.3s, color 0.3s, transform 0.3s' }}>
                                        <Link className='text-sm text-decoration-none' to={'/auth/register'} 
                                            style={{ color: '#ffffff', transition: 'color 0.3s ease, font-size 0.3s ease' }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = '#e0e0e0'; 
                                                e.currentTarget.style.fontSize = '18px'; 
                                            }} 
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = '#ffffff'; 
                                                e.currentTarget.style.fontSize = '16px'; 
                                            }}>
                                            Register New Account
                                        </Link>
                                    </button>
                                </>
                            )}
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}