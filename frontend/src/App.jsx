import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AcademicsPage from './pages/AcademicsPageCompat.jsx';
import AdmissionPage from './pages/AdmissionPage';
import NoticeBoard from './pages/NoticeBoard';
import ContactPage from './pages/ContactPage';
import FacultyPage from './pages/FacultyPage';
import GalleryPage from './pages/GalleryPage';

// Admin / Auth Pages
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEnquiries from './pages/admin/ManageEnquiries';
import ManageNotices from './pages/admin/ManageNotices';
import ManageContactMessages from './pages/admin/ManageContactMessages';
import ManageStudents from './pages/admin/ManageStudents';
import ManageFees from './pages/admin/ManageFees';
import ManageGallery from './pages/admin/ManageGallery';
import ManageSettings from './pages/admin/ManageSettings';
import ManageStaff from './pages/admin/ManageStaff';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import MyProfile from './pages/admin/MyProfile';
import StudentFeeDetails from './pages/admin/StudentFeeDetails';
import StudentProfile from './pages/admin/StudentProfile';

import ScrollToTop from './components/ScrollToTop';

function App() {
  const CommonRoutes = (
    <>
      <Route index element={<AdminDashboard />} />
      <Route path="enquiries" element={<ManageEnquiries />} />
      <Route path="students" element={<ManageStudents />} />
      <Route path="students/:studentId" element={<StudentProfile />} />
      <Route path="notices" element={<ManageNotices />} />
      <Route path="fees" element={<ManageFees />} />
      <Route path="fees/:studentId" element={<StudentFeeDetails />} />
      <Route path="fees/:studentId/:studentName" element={<StudentFeeDetails />} />
      <Route path="contact-messages" element={<ManageContactMessages />} />
      <Route path="gallery" element={<ManageGallery />} />
      <Route path="testimonials" element={<ManageTestimonials />} />
      <Route path="settings" element={<ManageSettings />} />
      <Route path="staff" element={<ManageStaff />} />
    </>
  );

  const StaffRouteDefinitions = (
    <>
      {CommonRoutes}
      <Route path="profile" element={<MyProfile />} />
    </>
  );

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="academics" element={<AcademicsPage />} />
          <Route path="admission" element={<AdmissionPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="notices" element={<NoticeBoard />} />
          <Route path="gallery" element={<GalleryPage />} />
        </Route>
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes (no profile page) */}
        <Route path="/admin" element={<AdminLayout />}>
          {CommonRoutes}
        </Route>

        <Route path="/editor" element={<AdminLayout />}>
          {StaffRouteDefinitions}
        </Route>

        <Route path="/accountant" element={<AdminLayout />}>
          {StaffRouteDefinitions}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
