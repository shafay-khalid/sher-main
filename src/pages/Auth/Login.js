import { message } from 'antd';
import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import bg from "../../assets/images/bg3.jpg"; // Home page ka background image
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, firestore, provider } from '../../config/firebase'; // Import provider
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Login() {
  const { userLoggedIn, dispatch , storeUserInBackend} = useAuth();
  const [state, setState] = useState({ email: "", password: "" });
  const [isProcessing, setIsProcessing] = useState(false); // Add loading state
  const [isScreenLoading, setIsScreenLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsProcessing(true);
    setIsScreenLoading(true);
    const { email, password } = state;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : { fullName: '', role: '' };

      dispatch({
        type: "setLoggedIn",
        payload: {
          user: { fullName: userData.fullName, email: userData.email, uid: user.uid, role: userData.role }
        }
      });
      navigate('/');
      message.success("User  logged in successfully");
    } catch (error) {
      console.error(error.code);
      switch (error.code) {
        case "auth/invalid-credential":
          message.error("Incorrect email and password");
          break;
        default:
          message.error("Something went wrong while logging in");
          break;
      }
    } finally {
      setIsProcessing(false);
      setIsScreenLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      if (!user) {
        message.error("No user info received from Google!");
        return; // ❌ Stop if user not found
      }
  
      const userData = {
        fullName: user.displayName || '',
        email: user.email || '',
        role: 'user', // Google se role nahi aata, default dena zaroori hai
        profilePic: user.photoURL || '',
      };
  
      await setDoc(doc(firestore, 'users', user.uid), userData, { merge: true });
      await storeUserInBackend({
        fullName: userData.fullName,
        email: userData.email,
        uid: user.uid,
        role: userData.role,
      });
  
      message.success("Google login successful!"); 
      navigate('/'); // ✅ Redirect jab sab kuch success ho
    } catch (error) {
      console.error(error);
  
      // Special case handle: user khud popup band kar de
      if (error.code === 'auth/popup-closed-by-user') {
        // User ne khud band kiya popup, koi zaroorat nahi error show karne ki
      } else {
        message.error("Something went wrong during Google login!");
      }
    }
  };
  
  

  return (
    <main style={styles.loginPage}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card border-none p-4" style={styles.card}>
              {userLoggedIn && (<Navigate to={'/'} replace={true} />)}
              <h2 className='text-center mb-4' style={styles.heading}>Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    style={styles.input}
                    onFocus={(e) => { e.target.style.transform = "scale(1.05)"; e.target.style.borderColor = "#16a34a"; }}
                    onBlur={(e) => { e.target.style.transform = "scale(1)"; e.target.style.borderColor = "#ced4da"; }}
                    onChange={handleChange}
                    placeholder="Enter Email"
                    name="email"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    style={styles.input}
                    onFocus={(e) => { e.target.style.transform = "scale(1.05)"; e.target.style.borderColor = "#16a34a"; }}
                    onBlur={(e) => { e.target.style.transform = "scale(1)"; e.target.style.borderColor = "#ced4da"; }}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    name="password"
                  />
                </div>
                <button
                  className="btn w-100"
                  style={styles.button}
                  onMouseOver={(e) => { e.target.style.transform = "scale(1.05)"; }}
                  onMouseOut={(e) => { e.target.style.transform = "scale(1)"; }}
                >
                  Login
                </button>
                <button
                  type='button'
                  className="btn w-100 mt-2"
                  style={{ ...styles.button, backgroundColor: '#4285F4' }} // Google button style
                  onClick={handleGoogleSignIn}
                >
                  Continue with Google
                </button>
                <p className="mb-0 mt-2 text-center">
                  <span style={styles.linkText}>Don't have an account? <Link to="/auth/register" style={styles.link}>Register Now</Link></span>
                </p>
                <p className="mb-0 mt-1 text-center">
                  <Link to="/auth/forgotpassword" style={styles.link}>Forgot Password?</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// 🎨 CSS Styles
const styles = {
  loginPage: {
    minHeight: '100vh',
    backgroundImage: `url(${bg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent white background
    backdropFilter: 'blur(10px)', // Blur effect
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
  },
  heading: {
    color: "#16a34a",
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    fontSize: '16px',
    transition: 'transform 0.3s ease', // Only transform on focus
  },
  button: {
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    padding: '10px',
    fontSize: '18px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
  },
  linkText: {
    color: 'white', // White text color
  },
  link: {
    color: 'white', // White color for the link
    textDecoration: 'underline', // Optional: Underline the link
  },
};