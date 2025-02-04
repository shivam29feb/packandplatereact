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
import AdminSignup from '../components/pages/public/AdminSignup/AdminSignup';
import MemberDashboard from '../components/pages/member-only/member/MemberDashboard/MemberDashboard';
import Pricing from '../components/pages/public/Pricing/Pricing';
import FeatureRequest from '../components/pages/public/FeatureRequest/FeatureRequest';
import ReportAnIssue from '../components/pages/public/ReportAnIssue/ReportAnIssue';
import TermsAndConditions from '../components/pages/public/TermsAndConditions/TermsAndConditions';
import PrivacyPolicy from '../components/pages/public/PrivacyPolicy/PrivacyPolicy';
import Sitemap from '../components/pages/public/Sitemap/Sitemap';
import FeatureRequestTerms from '../components/pages/public/FeatureRequestTerms/FeatureRequestTerms';
import MemberProfile from '../components/pages/member-only/member/MemberProfile/MemberProfile';

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
      <Route path="/admin-signup" element={<AdminSignup />} />

      {/* Member only routes  */}
      <Route path="/member/dashboard" element={<MemberDashboard />} />
      <Route path="/member/profile" element={<MemberProfile />} />
      <Route path="/add-dish" element={<AddDish />} />
      <Route path="/member/view-dish/:id" element={<ViewDish />} />
      
    </Routes>
  );
};

export default AppRoutes;
