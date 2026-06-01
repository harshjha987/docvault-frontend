import { useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';

  export default function OAuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (token) {
        localStorage.setItem('token', token);
        // force a full page redirect instead of react router navigation
        window.location.href = '/dashboard';
      } else {
        navigate('/login');
      }
    }, []);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Logging you in...</p>
      </div>
    );
  }
