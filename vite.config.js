import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for a React project.  The @vitejs/plugin-react plugin
// enables support for JSX and the React Fast Refresh integration.  For more
// information on how Vite operates, see the official documentation.  In
// development mode, Vite serves ES modules directly and provides instant
// Hot Module Replacement (HMR), while in production it uses Rollup to bundle
// and optimize your code【454112280174638†L325-L381】.
export default defineConfig({
  plugins: [react()],
  server: {
    // Configure CORS proxying if needed (not necessary when backend accepts all origins).
    // proxy: {
    //   '/api': 'http://localhost:8080',
    // },
  },
});