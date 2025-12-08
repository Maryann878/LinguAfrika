# LinguAfrika Frontend

Complete React + TypeScript + Tailwind CSS + shadcn/ui frontend application.

## ✅ Complete!

**27 Pages Created** - All pages are ready and use reusable components!

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Copy Assets**
   Copy images from `../public/` to `frontend/public/`:
   - logo.png
   - frame.png
   - IconV.png
   - yoruba.png, hausa.png, igbo.png, efik.png
   - And any other assets you need

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 📦 What's Included

### Pages (27 total)
- Authentication: SplashScreen, Login, SignUp, ResetEmail, ResetPassword, Verification
- Onboarding: Welcome, WelcomeOB, CreateProfile, Onboarding
- Main App: Dashboard, Landing, Languages, Levels, CourseOverview, CourseDashboard, StartLearning, Lesson
- Profile: Profile, EditProfile, Settings
- Community: Community, Channel, AIChat
- Other: LearningProgress, Quiz, Feedback, HelpSupport, AboutUs, CourseReg

### Components
- shadcn/ui: Button, Input, Card, Label, Badge, Toast
- Custom: CourseCard, StatCard, Layout, Navbar, ProgressBar, Modal

### Services
- auth.ts - Authentication API service

## 🎨 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Router v7** - Routing
- **Lucide React** - Icons
- **Axios** - HTTP client

## 📝 Notes

- All components use Tailwind CSS (no custom CSS files)
- All pages use reusable shadcn/ui components
- API calls use `/api` prefix (handled by Vite proxy)
- Type-safe with TypeScript throughout

## 🔧 Configuration

- `vite.config.ts` - Vite configuration with API proxy
- `tailwind.config.js` - Tailwind with custom colors
- `components.json` - shadcn/ui configuration
- `tsconfig.json` - TypeScript configuration

## 📚 Next Steps

1. Copy assets to `public/` folder
2. Connect to backend API
3. Add authentication context
4. Implement form validation
5. Add loading states
6. Deploy!
