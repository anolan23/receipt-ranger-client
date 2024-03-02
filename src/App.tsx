import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/dashboard';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<div>Login</div>} />
        <Route path="signup" element={<div>Signup</div>} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
