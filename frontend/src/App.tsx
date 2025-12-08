import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/Components/ErrorBoundary";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetEmail from './pages/ResetEmail';
import ResetOTP from './pages/ResetOTP';
import ResetPassword from './pages/ResetPassword';
import SplashScreen from './pages/SplashScreen';
import Welcome from './pages/Welcome';
import CourseRegistration from './pages/CourseReg';
import Dashboard from './pages/Dashboard';
import CourseOverview from './pages/CourseOverview';
import Feedback from './pages/Feedback';
import ProfilePage from './pages/Profile';
import Layout from './Components/Layout/Layout';
import CreateProfile from './pages/CreateProfile';
import Verification from './pages/Verification';
import Onboarding from './pages/Onboarding';
import Levels from './pages/Levels';
import EditProfile from './pages/EditProfile';
import WelcomeOB from './pages/WelcomeOB';
import WelcomeOnboarding from './pages/WelcomeOnboarding';
import CourseDashboard from './pages/CourseDashboard';
import StartLearning from './pages/StartLearning';
import Lesson from './pages/Lesson';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';
import LearningProgress from './pages/LearningProgress';
import Community from './pages/Community';
import Channel from './pages/Channel';
import AIChat from './pages/AIChat';
import Languages from './pages/Languages';
import Quiz from './pages/Quiz';
import AboutUs from './pages/AboutUs';


// LandingRedirect component removed - not currently used

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Toaster />
      <Routes>
        <Route path="/" element={<SplashScreen />} /> 

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-email" element={<ResetEmail />} />
        <Route path="/reset-otp" element={<ResetOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Welcome Flow */}
        <Route path="/welcome-onboarding" element={<WelcomeOnboarding />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/register-course" element={<CourseRegistration />} />
        <Route path="/welcome-on-board" element={<WelcomeOB />} />
        <Route path="/welcome" element={<Welcome />} />

        {/* Main Content - Protected Routes with Layout */}
        <Route element={<Layout />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Learning Routes */}
          <Route path="/languages" element={<Languages />} />
          <Route path="/course/:courseName" element={<Levels />} />
          <Route path="/course-dashboard/:courseName/:levelName" element={<CourseDashboard />} />
          <Route path="/lesson/:topicId" element={<Lesson />} />
          <Route path="/learning-progress" element={<LearningProgress />} />
          
          {/* Community */}
          <Route path="/community" element={<Community />} />
          <Route path="/community/:channelName" element={<Channel />} />
          
          {/* Tools & Features */}
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/quiz" element={<Quiz />} />
          
          {/* Profile & Settings */}
          <Route path="/profile-page" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help-support" element={<HelpSupport />} />
          
          {/* Legacy/Additional Routes - Redirects for backward compatibility */}
          <Route path="/landing" element={<Navigate to="/languages" replace />} />
          <Route path="/levels" element={<Navigate to="/languages" replace />} />
          <Route path="/course-overview" element={<CourseOverview />} />
          <Route path="/start-learning" element={<StartLearning />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/register-course" element={<CourseRegistration />} />
        </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
