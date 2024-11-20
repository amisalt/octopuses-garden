import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import {config} from 'dotenv'
config()
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    host:true,
    preview:{
      port:process.env.PORT
    }
  }
})
