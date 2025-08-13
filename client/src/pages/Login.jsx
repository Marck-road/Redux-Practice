import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../store/authSlice';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json(); 

    if (!res.ok) {
      setError(data.msg || 'Login failed');
      return;
    }

    dispatch(loginSuccess(data.token));
    navigate('/tasks');
    
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }} className='login-container'>
      <h2 className='login-title'>Login</h2>
      <form onSubmit={handleLogin} className='form-container'>
        <input className='input' value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input className='input' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button className='login-button' type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default Login;
