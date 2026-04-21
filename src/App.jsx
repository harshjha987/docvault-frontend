import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Folders from './pages/Folders';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}
function PublicRoute({ children }) {
  const { token } = useAuth();
  return token ? <Navigate to="/dashboard" /> : children;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <div className="page-transition">
                  <Landing />
                </div>
              }
            />
            <Route path="/login" element={
   
      <Login />
   
  } />
  <Route path="/register" element={
   
      <Register />
    
  } />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/folders"
              element={
                <ProtectedRoute>
                  <Folders />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
