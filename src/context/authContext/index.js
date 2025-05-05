import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenLoader from '../../components/ScreenLoader';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { message } from 'antd';
import axios from 'axios'

const AuthContext = createContext();

const initialState = { isAuthenticated: false, user: { fullName: '', email: '', uid: '', role: '' } };

const api = 'https://distinct-seana-shafay-khalid-fc93f8ee.koyeb.app/'

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "setLoggedIn":
      return { ...state, isAuthenticated: true, user: { ...payload.user } };
    case "SET_PROFILE":
      return { ...state, user: { ...payload.user } };
    case "setLoggedOut":
      return initialState;
    default:
      return state;
  }
};

export default function AuthProvider({ children }) { // Change the name here
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { email, uid } = user;
        try {
          setIsProcessing(true);
          const userDoc = await getDoc(doc(firestore, 'users', uid));
          const userData = userDoc.exists() ? userDoc.data() : { fullName: '', email: '', role: '' };
          dispatch({
            type: "setLoggedIn",
            payload: {
              user: { fullName: userData.fullName, email, uid, role: userData.role }
            }
          });
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      } else {
        dispatch({ type: "setLoggedOut" });
      }
      setIsScreenLoading(false);
      setIsProcessing(false);
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [dispatch]);

  const storeUserInBackend = async (user) => {
    try {
        const response = await axios.post(`${api}storeUser`, {
            fullName: user.fullName,
            email: user.email,
            uid: user.uid,
            role: user.role,
        });
        return response.data; // Return the response data
    } catch (error) {
        console.error("Error storing user in backend:", error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};

  const login = async (email, password) => {
    setIsProcessing(true);
    setIsScreenLoading(true);
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

  const register = async (fullName, email, password) => {
    setIsProcessing(true);
    setIsScreenLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        fullName,
        email,
        role: 'buyer',
      });

      dispatch({
        type: "setLoggedIn",
        payload: {
          user: { fullName, email, uid: user.uid, role: 'buyer', }
        }
      });
      navigate('/');
      message.success("User  registered successfully");
    } catch (error) {
      console.error(error.code);
      message.error("Registration failed: " + error.message);
    } finally {
      setIsProcessing(false);
      setIsScreenLoading(false);
    }
  };

  const logout = () => {
    signOut(auth).then(() => {
      message.success('User  logged out');
      dispatch({ type: 'setLoggedOut' });
      navigate('/');
    }).catch((error) => {
      console.error(error.code);
      message.error('Something went wrong while logging out');
    });
  };

  const updateUser  = async (updatedUser ) => {
    const userId = state.user.uid;
    if (!userId) return;
    try {
      await updateDoc(doc(firestore, 'users', userId), {
        fullName: updatedUser .name,
      });

      dispatch({
        type: "SET_PROFILE",
        payload: {
          user: { ...state.user, ...updatedUser  }
        }
      });
      message.success("User  profile updated successfully");
    } catch (error) {
      console.error("Error updating user data:", error);
      message.error("Failed to update user profile");
    }
  };

  return (
    <AuthContext.Provider value={{ state, dispatch,storeUserInBackend, login, register, logout, user: state.user, isScreenLoading, setIsScreenLoading, isProcessing, setIsProcessing, updateUser  }}>
      {isScreenLoading ? <ScreenLoader /> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);