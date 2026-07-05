import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Signup.jsx';
import Signin from './Signin.jsx';
import ForgotPassword from './ForgotPassword.jsx';
import ResetPassword from './ResetPassword.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
         <Route path="/login" element={<Signin />} />
         <Route path="/register" element={<Signup />} />
         <Route path="/forget-password" element={<ForgotPassword />} />
         <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;