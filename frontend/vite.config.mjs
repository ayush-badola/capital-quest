// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     include: [
//       'react',
//       'react-dom',
//       'react-router-dom',
//       'axios',
//       'socket.io-client'
//     ]
//   },
//   build: {
//     rollupOptions: {
//       input: {
//         main: './index.html'
//       }
//     }
//   },
//   server: {
//     proxy: {
//       // '/api': 'http://localhost:5000',
//       '/api': import.meta.env.VITE_API_URL,
//       '/socket.io': {
//         // target: 'http://localhost:5000',
//         target: import.meta.env.VITE_API_URL,
//         ws: true
//       }
//     }
//   }
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        ws: true,
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  // esbuild: {
  //   jsxInject: `import React from 'react'`
  // }
});