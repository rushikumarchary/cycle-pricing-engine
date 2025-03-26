import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextDefinition';

export const useAuth = () => useContext(AuthContext); 