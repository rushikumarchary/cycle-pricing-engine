import { useState, useEffect } from 'react';
import { isAuthenticated, getUserName, getUserEmail } from '../utils/auth';
import { AuthContext } from './AuthContextDefinition';

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const updateUserStatus = () => {
    if (isAuthenticated()) {
      const name = getUserName();
      const email = getUserEmail();
      setUserName(name);
      setUserEmail(email);
    } else {
      setUserName(null);
      setUserEmail(null);
    }
  };

  useEffect(() => {
    updateUserStatus();
    
    const handleLogin = () => {
      updateUserStatus();
    };

    window.addEventListener('userLoggedIn', handleLogin);
    
    const interval = setInterval(updateUserStatus, 60000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('userLoggedIn', handleLogin);
    };
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    updateUserStatus();
    window.dispatchEvent(new Event('userLoggedIn'));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserName(null);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ userName, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 