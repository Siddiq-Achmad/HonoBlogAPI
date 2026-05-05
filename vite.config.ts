import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    devServer({
      entry: 'src/index.ts',
      exclude: [
        /^\/(?!api).*/, // Only handle /api and related backend routes in dev server if needed, 
        // but usually we want Hono to handle everything and serve static for others.
      ]
    })
  ],
  server: {
    port: 3000
  }
})
