import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../components/pages/public/Home/Home';
import Contact from '../components/pages/public/Contact/Contact';
import About from '../components/pages/public/About/About';
import AddDish from '../components/pages/member-only/member/Dishes/AddDish/AddDish';
import ViewDish from '../components/pages/member-only/member/Dishes/ViewDish/ViewDish';
import Signup from '../components/pages/public/Signup/Signup';
import Login from '../components/pages/public/Login/Login';
import AdminLogin from '../components/pages/public/AdminLogin/AdminLogin';
import MemberDashboard from '../components/pages/member-only/member/MemberDashboard/MemberDashboard';
import MemberProfile from '../components/pages/member-only/member/MemberProfile/MemberProfile';
import MemberSettings from '../components/pages/member-only/member/MemberSettings/MemberSettings';
// Admin components
import AdminDashboard from '../components/pages/member-only/admin/AdminDashboard/AdminDashboard';
import UserManagement from '../components/pages/member-only/admin/UserManagement/UserManagement';
import CustomerDashboard from '../components/pages/member-only/customer/CustomerDashboard/CustomerDashboard';
import Menu from '../components/pages/member-only/customer/Menu/Menu';
import Orders from '../components/pages/member-only/customer/Orders/Orders';
import Favorites from '../components/pages/member-only/customer/Favorites/Favorites';
import CustomerProfile from '../components/pages/member-only/customer/CustomerProfile/CustomerProfile';
import CustomerSettings from '../components/pages/member-only/customer/CustomerSettings/CustomerSettings';
import Pricing from '../components/pages/public/Pricing/Pricing';
import FeatureRequest from '../components/pages/public/FeatureRequest/FeatureRequest';
import ReportAnIssue from '../components/pages/public/ReportAnIssue/ReportAnIssue';
import TermsAndConditions from '../components/pages/public/TermsAndConditions/TermsAndConditions';
import PrivacyPolicy from '../components/pages/public/PrivacyPolicy/PrivacyPolicy';
import Sitemap from '../components/pages/public/Sitemap/Sitemap';
import FeatureRequestTerms from '../components/pages/public/FeatureRequestTerms/FeatureRequestTerms';
import Unauthorized from '../components/pages/public/Unauthorized/Unauthorized';
import ProtectedRoute from '../components/molecules/ProtectedRoute/ProtectedRoute';
import { UserType } from '../context/AuthContext';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes  */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/feature-request" element={<FeatureRequest />} />
      <Route path="/feature-request-terms" element={<FeatureRequestTerms />} />
      <Route path="/report-an-issue" element={<ReportAnIssue />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/sitemap" element={<Sitemap />} />


      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Error routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Member only routes  */}
      <Route path="/member/dashboard" element={
        <ProtectedRoute allowedRoles={['member']}>
          <MemberDashboard />
        </ProtectedRoute>
      } />
      <Route path="/member/profile" element={
        <ProtectedRoute allowedRoles={['member']}>
          <MemberProfile />
        </ProtectedRoute>
      } />
      <Route path="/member/settings" element={
        <ProtectedRoute allowedRoles={['member']}>
          <MemberSettings />
        </ProtectedRoute>
      } />
      <Route path="/add-dish" element={
        <ProtectedRoute allowedRoles={['member']}>
          <AddDish />
        </ProtectedRoute>
      } />
      <Route path="/member/view-dish/:id" element={
        <ProtectedRoute allowedRoles={['member']}>
          <ViewDish />
        </ProtectedRoute>
      } />

      {/* System Admin routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute 
          allowedRoles={['admin', 'system-admin'] as UserType[]}
          redirectPath="/admin-login"
        >
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute 
          allowedRoles={['admin', 'system-admin'] as UserType[]}
          redirectPath="/admin-login"
        >
          <UserManagement />
        </ProtectedRoute>
      } />

      {/* Customer only routes */}
      <Route path="/customer/dashboard" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <CustomerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/customer/menu" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <Menu />
        </ProtectedRoute>
      } />
      <Route path="/customer/orders" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <Orders />
        </ProtectedRoute>
      } />
      <Route path="/customer/favorites" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <Favorites />
        </ProtectedRoute>
      } />
      <Route path="/customer/profile" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <CustomerProfile />
        </ProtectedRoute>
      } />
      <Route path="/customer/settings" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <CustomerSettings />
        </ProtectedRoute>
      } />

    </Routes>
  );
};

export default AppRoutes;




