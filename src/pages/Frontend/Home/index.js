import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa'; // Import the cart icon
import bg from "../../../assets/images/bg3.jpg"; // Ensure this path is correct
import hm from "../../../assets/images/hm.jpg"; // Store image
import hm2 from "../../../assets/images/hm2.jpg"; // Store image 2
import hm3 from "../../../assets/images/hm3.jpg"; // Store image 3
import hm4 from "../../../assets/images/hm4.webp";
import clutches from "../../../assets/images/cltch.jpg";
import bag from "../../../assets/images/bag.webp";
import shoulderbags from "../../../assets/images/shlder.avif";
import handbags from "../../../assets/images/hb.jpg";
import totebags from "../../../assets/images/tt.webp";
import pouch from "../../../assets/images/pouch.png";
import crossbody from "../../../assets/images/crossbody.png";
import fannypacks from "../../../assets/images/fannypacks.png";
import backpacks from "../../../assets/images/backpacks.png";
import eveningbags from "../../../assets/images/en.jpg";
import jwellery from "../../../assets/images/jwellery.jpg";
import dress from "../../../assets/images/dress.avif";
import axios from 'axios'; // Import axios for fetching items
import { useAuth } from '../../../context/authContext';

// Store images for the main display
const images = [
    { src: hm, alt: "Store Item 1" },
    { src: hm4, alt: "Store Item 2" },
    { src: hm2, alt: "Store Item 2" },
    { src: hm3, alt: "Store Item 3" },
];

// Category images for the scrolling section
const categoryImages = [
    { src: clutches, alt: "Category 1", name: "Clutches", link: "/category/clutches" },
    { src: jwellery, alt: "Category 2", name: "Jewellery", link: "/category/jewellery" },
    { src: shoulderbags, alt: "Category 3", name: "Shoulder bags", link: "/category/shoulderbags" },
    { src: dress, alt: "Category 3", name: "Laddies dress", link: "/category/dress" },
    { src: eveningbags, alt: "Category 3", name: "Evening bags", link: "/category/eveningbags" },
    { src: totebags, alt: "Category 3", name: "Tote bags", link: "/category/totebags" },
    { src: pouch, alt: "Category 3", name: "Pouch", link: "/category/pouch" },
    { src: handbags, alt: "Category 2", name: "Hand bags", link: "/category/handbags" },
    { src: crossbody, alt: "Category 2", name: "Cross Body bags", link: "/category/crossbody" },
    { src: fannypacks, alt: "Category 2", name: "Fanny Packs", link: "/category/fannypacks" },
    { src: backpacks, alt: "Category 2", name: "Back Packs", link: "/category/backpacks" },
];

const HomePage = () => {
    const { state } = useAuth();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [items, setItems] = useState([]); // State to hold items
    const [loading, setLoading] = useState(true); // State to track loading status
    const [cartItemCount, setCartItemCount] = useState(0); // State for cart item count
    const [visibleItemIndex, setVisibleItemIndex] = useState(0); // State to track the currently visible item
    const categoryRef = useRef(null); // Reference for the category section
    const api = 'https://distinct-seana-shafay-khalid-fc93f8ee.koyeb.app';

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);
    useEffect(() => {
        // Fetch items from the backend
        const fetchItems = async () => {
            try {
                const response = await axios.get(`${api}/getItems`); // Adjust the endpoint as needed
                setItems(response.data); // Assuming the response contains an array of items
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, []);

    // Sort items by showingNumber in ascending order
    const sortedItems = items.sort((a, b) => a.showingNumber - b.showingNumber);

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

    // Automatic scrolling for categories
    useEffect(() => {
        const scrollInterval = setInterval(() => {
            if (categoryRef.current) {
                const scrollWidth = categoryRef.current.scrollWidth;
                const clientWidth = categoryRef.current.clientWidth;
                const scrollLeft = categoryRef.current.scrollLeft;

                if (scrollLeft + clientWidth >= scrollWidth) {
                    categoryRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    categoryRef.current.scrollBy({ left: 315, behavior: 'smooth' }); // Changed to 315px
                }
            }
        }, 4000); // Change scroll every 3 seconds

        return () => clearInterval(scrollInterval); // Cleanup interval on unmount
    }, []);

    const handleScroll = (direction) => {
        if (categoryRef.current) {
            const scrollAmount = direction === 'left' ? -315 : 315; // Changed to 315px
            categoryRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };


    const showMoreItems = () => {
        if (visibleItemIndex < sortedItems.length - 5) {
            setVisibleItemIndex(visibleItemIndex + 5);
        }
    };

    return (
        <div style={styles.homepage}>
            <div style={styles.imageContainer}>
                <img
                    src={images[currentImageIndex].src}
                    alt={images[currentImageIndex].alt}
                    style={styles.storeImage}
                />
            </div>
            {/* Horizontal Scrolling Section for Categories */}
            <h2 style={styles.categoriesHeading}>Categories</h2>
            <div style={styles.categoryControls}>
                <button onClick={() => handleScroll('left')} style={styles.scrollButton}>{"<"}</button>
                <div className='scrollSection' ref={categoryRef} style={styles.scrollSection}>
                    {categoryImages.map((category, index) => (
                        <div key={index} style={styles.scrollItem}>
                            <Link to={category.link} style={styles.categoryLink}>
                                <div style={styles.imageWrapper}>
                                    <img src={category.src} alt={category.alt} style={styles.scrollImage} />
                                </div>
                                <h3 style={styles.categoryName}>{category.name}</h3> {/* Category Name */}
                            </Link>
                        </div>
                    ))}
                </div>
                <button onClick={() => handleScroll('right')} style={styles.scrollButton}>{">"}</button>
            </div>

            {/* New Section for All Items */}
            <div className="container mt-5">
                <h2 className="text-center text-white">All Items</h2>
                <div className="row mt-4">
                    {sortedItems.slice(0, visibleItemIndex + 5).map((item) => (
                        <div key={item._id} className="col-6 col-md-3 mb-4">
                            <Link to={`/item/${item._id}`} className="text-decoration-none">
                                <div className="card shadow-sm">
                                    <div style={{ minHeight: '200px' }}>
                                        <img
                                            src={`${api}${item.imageUrls[0]}`}
                                            alt={item.name}
                                            className="card-img-top img-fluid"
                                            style={styles.itemImage}
                                        />
                                        {item.discount > 0 && (
                                            <div style={styles.discountOverlay}>
                                                <span style={styles.discountText}>{item.discount}% OFF</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                {visibleItemIndex < sortedItems.length - 5 && (
                    <button onClick={showMoreItems} style={styles.showMoreButton}>
                        Show More
                    </button>
                )}
            </div>
            {/* WhatsApp Button */}
            <a
                href="https://wa.me/923477065533" // Ensure the number is in international format (without +)
                target="_blank"
                rel="noopener noreferrer"
                style={styles.whatsappButton}
            >
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={styles.whatsappIcon} />
            </a>

            {/* Cart Button */}
            <Link to="/cart" style={styles.cartButton}>
                <FaShoppingCart style={styles.cartIcon} />
                {cartItemCount > 0 && (
                    <span style={styles.cartItemCount}>{cartItemCount}</span>
                )}
            </Link>
        </div>
    );
};

const styles = {
    homepage: {
        position: 'relative',
        minHeight: '100vh', // Ensure content can expand
        backgroundImage: `url(${bg})`, // Background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start', // Allow content to flow naturally
        overflowY: 'auto', // Enable scrolling when needed
        paddingBottom: '20px', // Add space at bottom for scrolling
    },
    imageContainer: {
        marginTop: "100px",
        position: 'relative',
        width: '90%', // Full width
        height: '500px', // Set a specific height for the image container
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', // Hide overflow
    },
    storeImage: {
        width: '100%', // Full width
        height: '100%', // Full height
        objectFit: 'cover', // Cover the area
        borderRadius: '8px', // Rounded corners for images
    },
    categoriesHeading: {
        margin: '10px 0', // Space above and below the heading
        fontSize: '32px', // Font size for the categories heading
        textAlign: 'center', // Center the heading
        color: "white",
    },
    categoryControls: {
        display: 'flex',
        alignItems: 'center',
        width: '100%', // Full width
    },
    scrollButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Transparent white background
        border: 'none',
        color: 'black',
        fontSize: '24px',
        cursor: 'pointer',
        padding: '10px',
        fontWeight: 'bold', // Make the button text bold
        borderRadius: '5px', // Rounded corners for buttons
        margin: '0 5px', // Space between buttons
    },
    scrollSection: {
        display: 'flex',
        alignItems: 'center',
        overflowX: 'hidden', // Disable horizontal scrolling
        padding: '1px', // Padding for the scroll section
        width: '100%', // Full width
        backgroundColor: 'transparent', // Slightly transparent background
        scrollBehavior: 'smooth',
    },
    scrollItem: {
        minWidth: '300px', // Minimum width for each item
        margin: '0 10px', // Space between items
        borderRadius: '8px', // Rounded corners
        overflow: 'hidden', // Hide overflow
        textAlign: 'center', // Center text
    },
    imageWrapper: {
        height: '300px'
    },    itemsContainer: {
        display: 'flex',
        flexWrap: 'wrap', // Allow items to wrap to the next line
        justifyContent: 'center', // Center items horizontally
        width: '90%', // Full width
        margin: '0 auto', // Center the container
    },
    itemWrapper: {
        width: '50%', // 50% of the total screen width
        padding: '10px', // Space between items
        textAlign: 'center', // Center text
    },
    imageContainerFixed: {
        width: '100%', // Full width of the item wrapper
        height: '270px', // Fixed height
        overflow: 'hidden', // Hide overflow
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '9px'
    },
    scrollImage: {
        width: '100%', // Full width of the item
        height: '100%', // Full height of the item
        objectFit: "contain", // Ensure the image is fully visible
        transition: 'transform 0.3s ease', // Smooth transition for hover effect
        borderRadius: '9px'
    },
    categoryLink: {
        textDecoration: 'none', // Remove underline
        color: 'black', // Set text color to black
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light white background
        padding: '10px', // Add some padding
        borderRadius: '8px', // Rounded corners
        display: 'flex', // Use flex to center content
        flexDirection: 'column', // Stack image and text vertically
        alignItems: 'center', // Center items horizontally
        justifyContent: 'center', // Center items vertically
    },
    categoryName: {
        marginTop: '5px', // Space above the category name
        fontSize: '18px', // Font size for the category name
        color: 'black', // Black color for the category name
        fontWeight: 'bold', // Make the text bold
    },
    itemImage: {
        width: '100%',
        height: 'auto',
        position: 'relative',
        overflow: 'hidden',
    },
    discountOverlay: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: '#16a34a',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
    },
    discountText: {
        fontSize: '16px',
    },
    // Show More Button Styles
    showMoreButton: {
        backgroundColor: '#16a34a',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '20px',
    },
    // WhatsApp Button Styles
    whatsappButton: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#25D366', // WhatsApp green color
        borderRadius: '50%',
        padding: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        zIndex: 1000, // Ensure it stays on top
    },
    whatsappIcon: {
        width: '45px', // Size of the WhatsApp icon
        height: '45px',
    },
    // Cart Button Styles
    cartButton: {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        backgroundColor: '#25D366',
        borderRadius: '50%',
        padding: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        zIndex: 1000, // Ensure it stays on top
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartIcon: {
        fontSize: '45px', // Size of the cart icon
        color: '#ffffff',
    },
    cartItemCount: {
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        backgroundColor: 'red',
        color: 'white',
        borderRadius: '50%',
        padding: '2px 5px',
        fontSize: '12px',
        minWidth: '20px', // Ensure the badge has a minimum width
        textAlign: 'center', // Center the text in the badge
    },
};

// Media query for mobile devices
const mediaQueryStyles = {
    '@media (max-width: 768px)': {
        itemsContainer: {
            flexDirection: 'column', // Stack items vertically on mobile
        },
        itemWrapper: {
            width: '100%', // Full width for each item on mobile
        },
    },
};

// Merge media query styles with main styles
const combinedStyles = { ...styles, ...mediaQueryStyles };

export default HomePage;