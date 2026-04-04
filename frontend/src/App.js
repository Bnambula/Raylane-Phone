import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import PassengerHome from './pages/passenger/Home';
import SearchResults from './pages/passenger/Search';
import BookTrip from './pages/passenger/BookTrip';
import Parcels from './pages/passenger/Parcels';
import TrackTicket from './pages/passenger/TrackTicket';
import Login from './pages/Login';
import OperatorDashboard from './pages/operator/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to='/login' replace />;
  if (role && user.role !== role) return <Navigate to='/' replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Passenger (public) */}
          <Route path='/' element={<PassengerHome />} />
          <Route path='/search' element={<SearchResults />} />
          <Route path='/book/:tripId' element={<BookTrip />} />
          <Route path='/parcels' element={<Parcels />} />
          <Route path='/track' element={<TrackTicket />} />

          {/* Auth */}
          <Route path='/login' element={<Login />} />

          {/* Operator */}
          <Route path='/operator' element={
            <ProtectedRoute role='operator'><OperatorDashboard /></ProtectedRoute>
          } />

          {/* Admin */}
          <Route path='/admin' element={
            <ProtectedRoute role='admin'><AdminDashboard /></ProtectedRoute>
          } />

          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
