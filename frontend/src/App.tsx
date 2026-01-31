import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import JobSearch from './pages/JobSearch';
import Matches from './pages/Matches';
import Profile from './pages/Profile';
import Login from './pages/Login';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  return (
    <>
      <ThemeToggle />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="jobs" element={<JobSearch />} />
          <Route path="matches" element={<Matches />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
