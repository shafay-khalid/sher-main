import { message } from 'antd';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import bg from "../../assets/images/bg3.jpg"; // Ensure this path is correct
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, firestore } from '../../config/firebase';
import { setDoc, doc } from 'firebase/firestore'; // Correct imports
import { GoogleAuthProvider } from 'firebase/auth'; // Correct import

export default function Register() {
  const { dispatch, storeUserInBackend } = useAuth();
  const [state, setState] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false); // Define loading state
  const navigate = useNavigate();

  const handleChange = (e) => setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const { fullName, email, password } = state;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        fullName,
        email,
        role: 'buyer',
      });

      // Store user data in backend
      await storeUserInBackend({
        fullName,
        email,
        uid: user.uid,
        role: 'buyer',
      });

      dispatch({
        type: "setLoggedIn",
        payload: {
          user: { fullName, email, uid: user.uid, role: 'buyer' }
        }
      });
      navigate('/');
      message.success("User  registered successfully");
    } catch (error) {
      console.error("Registration failed: ", error);
      message.error("Registered" + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        fullName: user.displayName,
        email: user.email,
        role: 'buyer',
        profilePic: user.photoURL || '',
      };

      // Save user data to Firestore
      await setDoc(doc(firestore, 'users', user.uid), userData);
      message.success('User  registered successfully with Google!');

      // Store user data in backend
      await storeUserInBackend({
        fullName: userData.fullName,
        email: userData.email,
        uid: user.uid,
        role: userData.role,
      });

      resetForm(); // Reset form after successful registration
      navigate('/'); // Redirect to home or another page
    } catch (error) {
      console.error("sign-in ", error); 
      handleError(error); // Handle error
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setState({ fullName: "", email: "", password: "" }); // Reset form fields
  };

  const handleError = (error) => {
    message.error("Error: " + error.message); // Display error message
  };

  return (
    <main style={styles.authPage}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card border-none p-4" style={styles.card}>
              <h2 style={styles.heading}>Register</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  style={styles.input}
                  placeholder='Enter Full Name'
                  name='fullName'
                  onChange={handleChange}
                  onFocus={(e) => { e.target.style.transform = "scale(1.05)"; }}
                  onBlur={(e) => { e.target.style.transform = "scale(1)"; }}
                />
                <input
                  type="email"
                  style={styles.input}
                  placeholder='Enter Email'
                  name='email'
                  onChange={handleChange}
                  onFocus={(e) => { e.target.style.transform = "scale(1.05)"; }}
                  onBlur={(e) => { e.target.style.transform = "scale(1)"; }}
                />
                <input
                  type="password"
                  style={styles.input}
                  placeholder='Enter Password'
                  name='password'
                  onChange={handleChange}
                  onFocus={(e) => { e.target.style.transform = "scale(1.05)"; }}
                  onBlur={(e) => { e.target.style.transform = "scale(1)"; }}
                />
                <button
                  type="submit"
                  style={styles.button}
                  onMouseOver={(e) => { e.target.style.transform = "scale(1.05)"; }}
                  onMouseOut={(e) => { e.target.style.transform = "scale(1)"; }}
                >
                  Register
                </button>
                <button
                  type='button'
                  className="btn w-100 mt-2"
                  style={{ ...styles.button, backgroundColor: '#4285F4' }} // Google button style
                  onClick={handleGoogleLogin}
                >
                  Continue with Google
                </button>
                <p style={styles.text}>Already have an account? <Link to="/auth/login" style={styles.link}>Login Now</Link></p>
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
  authPage: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `url(${bg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent white background
    backdropFilter: 'blur(10px)', // Blur effect
    borderRadius: '10px',
    padding: '20px',
    margin: '20px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
  },
  heading: {
    color: '#fff',
    marginBottom: '20px',
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
    width: '100%',
    padding: '12px',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  text: {
    marginTop: '10px',
    color: 'white',
  },
  link: {
    color: 'white',
    textDecoration: 'underline',
  },
};