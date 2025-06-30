import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
  'process.env': {
    PICA_SECRET_KEY: JSON.stringify(process.env.PICA_SECRET_KEY),
    PICA_OPENAI_CONNECTION_KEY: JSON.stringify(process.env.PICA_OPENAI_CONNECTION_KEY)
  }
}

});
