# LinguAfrika Frontend Setup

## ✅ Completed Setup

### 1. **shadcn/ui Integration**
- ✅ Installed shadcn/ui dependencies
- ✅ Configured `components.json`
- ✅ Set up Tailwind with CSS variables
- ✅ Created utility functions (`lib/utils.ts`)

### 2. **Reusable UI Components Created**
- ✅ `Button` - Multiple variants (default, destructive, outline, secondary, ghost, link)
- ✅ `Input` - Form input with proper styling
- ✅ `Card` - Card components (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- ✅ `Label` - Form labels
- ✅ `Toast` - Toast notifications with variants
- ✅ `Toaster` - Toast provider component

### 3. **Example Pages Created**
- ✅ `Login` - Authentication page using reusable components
- ✅ `Dashboard` - Main dashboard with stats and course cards

### 4. **Services**
- ✅ `auth.ts` - Authentication API service

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/          # shadcn/ui components (reusable)
│   │   └── ...          # Feature-specific components
│   ├── pages/           # Page components
│   │   ├── Login.tsx
│   │   └── Dashboard.tsx
│   ├── lib/
│   │   └── utils.ts     # Utility functions (cn helper)
│   ├── services/        # API services
│   │   └── auth.ts
│   ├── App.tsx
│   └── index.tsx
├── components.json      # shadcn/ui config
└── tailwind.config.js   # Tailwind with shadcn variables
```

## 🚀 Next Steps

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Create More Pages
Create pages in `src/pages/` using the reusable components:
- `SignUp.tsx`
- `Landing.tsx`
- `Profile.tsx`
- etc.

### 3. Add More shadcn Components (as needed)
```bash
npx shadcn-ui@latest add [component-name]
```

Available components:
- `dialog` - For modals
- `dropdown-menu` - For dropdowns
- `form` - For form handling
- `select` - For select inputs
- `tabs` - For tabbed interfaces
- And many more...

### 4. Create Feature Components
Create reusable feature components in `src/components/`:
- `CourseCard.tsx`
- `LanguageCard.tsx`
- `ProgressBar.tsx`
- `Navbar.tsx` (already exists, update to use shadcn)

## 💡 Best Practices

1. **Use Reusable Components**: Always check `src/components/ui/` first before creating new components
2. **Consistent Styling**: Use Tailwind classes and the `cn()` utility for conditional classes
3. **Type Safety**: All components are fully typed with TypeScript
4. **Accessibility**: shadcn components are built with accessibility in mind

## 🎨 Customization

### Colors
Edit `src/index.css` to change the color scheme. The primary color is already set to `#E37400` (orange).

### Adding New Components
1. Use shadcn CLI: `npx shadcn-ui@latest add [component]`
2. Or manually create in `src/components/ui/`

## 📝 Notes

- All API calls should use `/api` prefix (handled by Vite proxy)
- Toast notifications are available via `useToast()` hook
- All components use Tailwind CSS - no custom CSS files needed (except for complex animations)


