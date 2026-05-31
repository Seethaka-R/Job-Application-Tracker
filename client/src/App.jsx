import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AllJobs from './pages/AllJobs';
import AddJob from './pages/AddJob';
import EditJob from './pages/EditJob';
import BrowseJobs from './pages/BrowseJobs';
import PostJob from './pages/PostJob';
import Profile from './pages/Profile';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/all-jobs" element={<ProtectedRoute><AllJobs /></ProtectedRoute>} />
          <Route path="/add-job" element={<ProtectedRoute><AddJob /></ProtectedRoute>} />
          <Route path="/edit-job/:id" element={<ProtectedRoute><EditJob /></ProtectedRoute>} />
          <Route path="/browse-jobs" element={<ProtectedRoute><BrowseJobs /></ProtectedRoute>} />
          <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </Layout>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
