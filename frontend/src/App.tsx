import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LoadingScreen } from "@/components/LoadingScreen";

// Lazy load components for code splitting
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ResetEmail = lazy(() => import('./pages/ResetEmail'));
const ResetOTP = lazy(() => import('./pages/ResetOTP'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const SplashScreen = lazy(() => import('./pages/SplashScreen'));
const Welcome = lazy(() => import('./pages/Welcome'));
const CourseRegistration = lazy(() => import('./pages/CourseReg'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CourseOverview = lazy(() => import('./pages/CourseOverview'));
const Feedback = lazy(() => import('./pages/Feedback'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const Layout = lazy(() => import('./components/Layout/Layout'));
const CreateProfile = lazy(() => import('./pages/CreateProfile'));
const Verification = lazy(() => import('./pages/Verification'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Levels = lazy(() => import('./pages/Levels'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const WelcomeOB = lazy(() => import('./pages/WelcomeOB'));
const WelcomeOnboarding = lazy(() => import('./pages/WelcomeOnboarding'));
const CourseDashboard = lazy(() => import('./pages/CourseDashboard'));
const StartLearning = lazy(() => import('./pages/StartLearning'));
const Lesson = lazy(() => import('./pages/Lesson'));
const Settings = lazy(() => import('./pages/Settings'));
const HelpSupport = lazy(() => import('./pages/HelpSupport'));
const LearningProgress = lazy(() => import('./pages/LearningProgress'));
const Community = lazy(() => import('./pages/Community'));
const Channel = lazy(() => import('./pages/Channel'));
const AIChat = lazy(() => import('./pages/AIChat'));
const Languages = lazy(() => import('./pages/Languages'));
const Quiz = lazy(() => import('./pages/Quiz'));
const AboutUs = lazy(() => import('./pages/AboutUs'));


// LandingRedirect component removed - not currently used

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Minimal delay for smooth transition
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 100); // Reduced delay for faster loading

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return <LoadingScreen message="Loading LinguAfrika..." />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <Toaster />
        <Suspense fallback={<LoadingScreen message="Loading page..." />}>
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
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
