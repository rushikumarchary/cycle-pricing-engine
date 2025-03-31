import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      welcome: 'Welcome',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      username: 'Username',
      submit: 'Submit',
      cancel: 'Cancel',
      
      // Navigation
      home: 'Home',
      profile: 'Profile',
      settings: 'Settings',
      calculatePrice: 'Calculate Price',
      estimatedPrice: 'Estimated Price',
      orders: 'Orders',
      cycle:'Cycle',
      PricingEngine: ' Pricing Engine',
      
      // Messages
      loginSuccess: 'Successfully logged in',
      loginError: 'Login failed',
      registerSuccess: 'Registration successful',
      registerError: 'Registration failed',
      unexpectedError: 'An unexpected error occurred',
      
      // Form Labels
      firstName: 'First Name',
      lastName: 'Last Name',
      phoneNumber: 'Phone Number',
      address: 'Address',
      
      // Cart
      cart: 'Cart',
      cartEmpty: 'Your cart is empty',
      checkout: 'Checkout',
      total: 'Total',
      remove: 'Remove',
      quantity: 'Quantity',
      
      // Calculate Form
      cycleDetails: 'Cycle Details',
      brand: 'Brand',
      model: 'Model',
      year: 'Year',
      condition: 'Condition',
      calculate: 'Calculate',
      
      // Estimates
      estimatedValue: 'Estimated Value',
      priceRange: 'Price Range',
      
      // Sign Up
      createAccount: 'Create Account',
      confirmPassword: 'Confirm Password',
      alreadyHaveAccount: 'Already have an account?',
      
      // Sign In
      dontHaveAccount: "Don't have an account?",
      forgotPassword: 'Forgot Password?',
      rememberMe: 'Remember Me',
      
      // Footer
      aboutUs: 'About Us',
      contactUs: 'Contact Us',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      
      // Buttons
      addToCart: 'Add to Cart',
      viewDetails: 'View Details',
      continue: 'Continue',
      back: 'Back',
      
      // Validation Messages
      required: 'This field is required',
      invalidEmail: 'Invalid email address',
      passwordMismatch: 'Passwords do not match',
      minimumLength: 'Minimum length is {{length}} characters',
      usernameNoAt: 'Username cannot contain @',
      usernameLowercase: 'Username must be lowercase',
      usernameFormat: 'Username can only contain lowercase letters, numbers, underscores, and hyphens'
    }
  },
  hi: {
    translation: {
      // Common
      welcome: 'स्वागत है',
      login: 'लॉग इन',
      register: 'पंजीकरण',
      logout: 'लॉग आउट',
      email: 'ईमेल',
      password: 'पासवर्ड',
      username: 'यूजरनेम',
      submit: 'सबमिट',
      cancel: 'रद्द करें',
      
      // Navigation
      home: 'होम',
      profile: 'प्रोफ़ाइल',
      settings: 'सेटिंग्स',
      calculatePrice: 'मूल्य की गणना करें',
      estimatedPrice: 'अनुमानित मूल्य',
      orders: 'ऑर्डर',
      cycle:'साइकिल',
      PricingEngine: ' मूल्य इंजन',
      
      // Messages
      loginSuccess: 'सफलतापूर्वक लॉग इन किया गया',
      loginError: 'लॉग इन विफल',
      registerSuccess: 'पंजीकरण सफल',
      registerError: 'पंजीकरण विफल',
      unexpectedError: 'एक अनपेक्षित त्रुटि हुई',
      
      // Form Labels
      firstName: 'पहला नाम',
      lastName: 'अंतिम नाम',
      phoneNumber: 'फ़ोन नंबर',
      address: 'पता',
      
      // Cart
      cart: 'कार्ट',
      cartEmpty: 'आपकी कार्ट खाली है',
      checkout: 'चेकआउट',
      total: 'कुल',
      remove: 'हटाएं',
      quantity: 'मात्रा',
      
      // Calculate Form
      cycleDetails: 'साइकिल विवरण',
      brand: 'ब्रांड',
      model: 'मॉडल',
      year: 'वर्ष',
      condition: 'स्थिति',
      calculate: 'गणना करें',
      
      // Estimates
      estimatedValue: 'अनुमानित मूल्य',
      priceRange: 'मूल्य सीमा',
      
      // Sign Up
      createAccount: 'खाता बनाएं',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      alreadyHaveAccount: 'पहले से खाता है?',
      
      // Sign In
      dontHaveAccount: 'खाता नहीं है?',
      forgotPassword: 'पासवर्ड भूल गए?',
      rememberMe: 'मुझे याद रखें',
      
      // Footer
      About: 'हमारे बारे में',
      contactUs: 'संपर्क करें',
      termsOfService: 'सेवा की शर्तें',
      privacyPolicy: 'गोपनीयता नीति',
      
      // Buttons
      addToCart: 'कार्ट में जोड़ें',
      viewDetails: 'विवरण देखें',
      continue: 'जारी रखें',
      back: 'वापस',
      
      // Validation Messages
      required: 'यह फ़ील्ड आवश्यक है',
      invalidEmail: 'अमान्य ईमेल पता',
      passwordMismatch: 'पासवर्ड मेल नहीं खाते',
      minimumLength: 'न्यूनतम लंबाई {{length}} अक्षर है',
      usernameNoAt: 'यूजरनेम में @ नहीं हो सकता',
      usernameLowercase: 'यूजरनेम लोअरकेस में होना चाहिए',
      usernameFormat: 'यूजरनेम में केवल लोअरकेस अक्षर, संख्याएं, अंडरस्कोर और हाइफ़न हो सकते हैं'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n; 