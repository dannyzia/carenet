import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import i18nSyncPlugin from './plugins/vite-i18n-sync'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    i18nSyncPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
      // Shim react-router so useNavigate is wrapped in startTransition
      // (prevents "component suspended during synchronous input" with React.lazy)
      'react-router-original': path.resolve(__dirname, 'node_modules/react-router'),
      'react-router': path.resolve(__dirname, 'src/lib/react-router-shim.ts'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})