import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const base = {
    plugins: [react()]
  };

  /**
   * build command 일 때는 base 설정만 사용 합니다.
   */
  if ('build' === command) {
    return base;
  }

  /**
   * 개발 환경에서는 proxy를 사용 합니다.
   */
  const env = loadEnv(mode, process.cwd(), '');
  return {
    ...base,
    server: {
      proxy: {
        '/api': {
          target: env.ONEDAY_CLASS_API,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    }
  };
});
