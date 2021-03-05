import { defineConfig, UserConfigExport } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

const isDev = process.env.NODE_ENV === 'development';
const base = isDev ? undefined : '/dist/';

const config: UserConfigExport = {
  plugins: [reactRefresh()],
  base,
  build: {
    outDir: isDev ? 'dist' : 'postcard-api/public/dist',
  },
};

// https://vitejs.dev/config/
export default defineConfig(config);

