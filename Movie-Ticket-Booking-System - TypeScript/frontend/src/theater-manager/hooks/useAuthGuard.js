import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthGuard = (requiredRole) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const userData = JSON.parse(user);
      if (userData.role !== requiredRole) {
        navigate('/', { replace: true });
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    }
  }, [requiredRole, navigate]);
};
