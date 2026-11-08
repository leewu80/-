import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // 相对路径，静态托管和 CDN 打开时资源不会指回 localhost。
  base: './',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // 预览域名的 Host 不是 localhost，不放开的话页面会直接被拒绝。
    allowedHosts: true,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
});
