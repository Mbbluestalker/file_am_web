# File AM Web - Project Structure

A React application built with Vite, following the same architecture pattern as stockavoo.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework

## Folder Structure

```
file_am_web/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, and other assets
│   ├── components/        # React components
│   │   └── common/        # Reusable common components (Button, Input, Modal, etc.)
│   ├── contexts/          # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages (Login, Register, etc.)
│   │   └── dashboard/     # Dashboard and main app pages
│   ├── services/          # API services and external integrations
│   ├── store/             # Redux store configuration
│   │   ├── api/           # RTK Query API slices
│   │   └── slices/        # Redux slices
│   ├── utils/             # Utility functions and constants
│   ├── App.jsx            # Root app component with routing
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles with Tailwind directives
├── .gitignore
├── package.json
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── vite.config.js         # Vite configuration
```

## Getting Started

### Installation

```bash
cd file_am_web
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Architecture Guidelines

### Components
- Place reusable components in `src/components/common/`
- Export common components from `src/components/common/index.js`
- Page-specific components can go in the same folder as the page

### Pages
- Each major feature should have its own folder in `src/pages/`
- Group related pages together (e.g., `auth/`, `dashboard/`)

### State Management
- Use Redux Toolkit for global state
- Create slices in `src/store/slices/`
- Use RTK Query for API calls in `src/store/api/`
- Configure the store in `src/store/store.js`

### Services
- API configuration and utilities go in `src/services/`
- Create service files for different API domains
- Base API configuration is in `src/services/api.js`

### Styling
- Tailwind CSS is configured and ready to use
- Global styles go in `src/index.css`
- Use Tailwind utility classes for component styling

### Routing
- All routes are defined in `src/App.jsx`
- Use React Router v6 conventions
- Route constants can be defined in `src/utils/constants.js`

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## Best Practices

1. **Component Structure**: Keep components small and focused
2. **File Naming**: Use PascalCase for component files, camelCase for utilities
3. **Import Order**: External imports → Internal imports → Styles
4. **Comments**: Add JSDoc comments for functions and components
5. **Error Handling**: Always handle errors in API calls and async operations

## Next Steps

1. Set up authentication pages in `src/pages/auth/`
2. Create common components (Button, Input, Modal) in `src/components/common/`
3. Configure API endpoints in `src/services/`
4. Add Redux slices for your app's state in `src/store/slices/`
5. Build your main application pages in `src/pages/dashboard/`

---

**Note**: This is a clean template based on the stockavoo architecture. Customize as needed for your specific requirements.
