# Assets Directory

This directory is for assets that need to be imported in code.

For static assets (images, fonts, etc.) that are referenced directly in HTML or public URLs, place them in the `public/` folder at the root of the frontend directory.

## Usage

### Public Assets (in `public/` folder)
```tsx
// Reference directly in src attribute
<img src="/logo.png" alt="Logo" />
```

### Imported Assets (in `src/assets/`)
```tsx
// Import and use
import logo from "@/assets/logo.png"
<img src={logo} alt="Logo" />
```

## Current Setup

- Static assets (logo.png, images, etc.) should be in `public/`
- These can be referenced with `/filename.png` in your code
- Vite will serve these from the public directory


