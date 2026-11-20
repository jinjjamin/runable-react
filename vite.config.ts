import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base: GitHub Pages 주소(https://jinjjamin.github.io/runable-react/)에 맞춰 빌드·미리보기(npm run preview)는 /runable-react/,
// 개발 서버(npm run dev)는 그대로 / 에서 엽니다. (docs/design.md 10장)
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/runable-react/' : '/',
  plugins: [react()],
}))
