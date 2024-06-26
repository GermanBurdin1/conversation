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

    const response = await fetch(`http://localhost:5001/users?email=${email}&password=${password}`);
    const data = await response.json();
    if (data.length > 0) {
      setIsLoggedIn(true);
      navigate('/');
    } else {
      alert('Failed to login');
    }
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
