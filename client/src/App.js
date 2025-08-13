import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';

const App = () => {
  const isLoggedIn = useSelector((state) => !!state.auth.token);
  
  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate to="/tasks" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tasks" element={isLoggedIn ? <Tasks /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default App;