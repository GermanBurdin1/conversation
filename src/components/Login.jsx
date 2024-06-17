import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Симуляция успешного логина
    setIsLoggedIn(true);
    navigate('/');
    // Комментируем реальный запрос на сервер
    /*
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
      // Save token to context or local storage
      setIsLoggedIn(true);
      // Redirect to the home page
      navigate('/');
    } else {
      alert('Failed to login');
    }
    */
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Dont have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}

