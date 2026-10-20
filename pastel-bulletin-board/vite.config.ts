import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Actions задаёт имя репозитория через переменную окружения.
// Для локального запуска используется корневой путь.
const env = (globalThis as any).process?.env ?? {}
const repositoryName = String(env.GITHUB_REPOSITORY ?? '').split('/')[1] ?? ''

export default defineConfig({
  plugins: [react()],
  base: env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}/` : '/',
})