import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthGuard = (requiredRole) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token || user.role !== requiredRole) {
      navigate('/login');
    }
  }, [token, user.role, navigate, requiredRole]);
};