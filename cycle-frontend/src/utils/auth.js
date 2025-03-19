import Swal from 'sweetalert2';

// Get token from localStorage
export const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  return token;
};

// Get user role from token
export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // console.log('Analyzing token payload:', payload);

    // Try different possible locations of the role in the payload
    let role = null;

    if (payload.role) {
      if (typeof payload.role === 'object' && payload.role.name) {
        role = payload.role.name;
        // console.log('Found role in payload.role.name:', role);
      } else {
        role = payload.role;
        // console.log('Found role in payload.role:', role);
      }
    } else if (payload.authorities) {
      role = payload.authorities;
      // console.log('Found role in payload.authorities:', role);
    }

    // console.log('Final extracted role:', role);
    return role;
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // console.error('Error extracting role from token:', error);
    return null;
  }
};

// Check if user has admin or manager role
export const hasManagementAccess = () => {
  const userRole = getUserRole();
  // console.log('Checking management access for role:', userRole);
  
  if (!userRole) {
    console.log('No role found');
    return false;
  }

  const hasAccess =userRole =='EMPLOYEE'|| userRole === 'ADMIN' || userRole === 'MANAGER';
  // console.log('Has management access:', hasAccess);
  return hasAccess;
};

// Check if user has required role
export const hasRequiredRole = (requiredRoles) => {
  const userRole = getUserRole();
  if (!userRole) return false;
  
  // If requiredRoles is an array, check if user's role is in it
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }
  
  // If requiredRoles is a single role
  return userRole === requiredRoles;
};

// Get auth header with token
export const getAuthHeader = () => {
  const token = getToken();
  if (!token) {
    // Show error message
    Swal.fire({
      icon: 'error',
      title: 'Authentication Error',
      text: 'You are not logged in. Please login to continue.',
      confirmButtonText: 'Go to Login'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/signIn';
      }
    });
    throw new Error('No auth token found');
  }

  // Return the header with Bearer token format
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    // Decode the JWT payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    // // Debug info
    // const debugInfo = {
    //   currentTime,
    //   expirationTime: payload.exp,
    //   timeRemaining: (payload.exp - currentTime) / 3600, // hours remaining
    //   isValid: payload.exp > currentTime
    // };
    // console.log('Token Debug Info:', debugInfo);

    // Token is valid if it has not expired
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

// Optional: Add a function to check remaining token time
export const getTokenExpirationTime = () => {
  const token = getToken();
  if (!token) return 0;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const timeRemaining = payload.exp - currentTime;
    
    // Return remaining time in hours
    return Math.max(0, timeRemaining / 3600);
  } catch (error) {
    console.error('Error getting token expiration time:', error);
    return 0;
  }
};

// Optional: Add a function to check if token needs renewal
export const shouldRenewToken = () => {
  const hoursRemaining = getTokenExpirationTime();
  // Consider renewing if less than 1 hour remains
  return hoursRemaining < 1;
};

// Helper function to decode and log token info (for debugging)
export const debugToken = () => {
  const token = getToken();
  if (!token) {
    console.log('No token found');
    return;
  }

  try {
     JSON.parse(atob(token.split('.')[1]));
    Math.floor(Date.now() / 1000);
    // console.log('Token Payload:', payload);
    // console.log('Expiration:', new Date(payload.exp * 1000).toLocaleString());
    // console.log('Current Time:', new Date().toLocaleString());
    // console.log('Hours Remaining:', (payload.exp - currentTime) / 3600);
    // console.log('Is Token Valid:', payload.exp > currentTime);
  } catch (error) {
    console.error('Error decoding token:', error);
  }
};

// Modified error handler for API calls
export const handleApiError = (error, navigate) => {
  console.log('API Error:', error);
  console.log('Response status:', error.response?.status);
  console.log('Current user role:', getUserRole());

  if (error.response?.status === 403) {
    if (!isAuthenticated()) {
      Swal.fire({
        icon: 'error',
        title: 'Session Expired',
        text: 'Your session has expired. Please login again.',
      }).then(() => {
        navigate('/signIn');
      });
    } else if (!hasManagementAccess()) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'You do not have permission to access this feature. Only Admins and Managers are allowed.',
      }).then(() => {
        navigate('/');
      });
    } else {
      // If authenticated and has role but still getting 403
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: error.response?.data || 'You do not have permission to perform this action.',
      });
    }
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data || 'An error occurred',
    });
  }
};

// Add this new function to get user name from token
export const getUserName = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Assuming the name is stored in the token payload as 'name' or 'sub'
    return payload.name || payload.sub || null;
  } catch (error) {
    console.error('Error extracting name from token:', error);
    return null;
  }
};

// Add this new function to get user email from token
export const getUserEmail = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Assuming the email is stored in the token payload as 'email' or 'sub'
    return payload.email || null;
  } catch (error) {
    console.error('Error extracting email from token:', error);
    return null;
  }
};