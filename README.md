# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deployment to VPS (Linux)

1. **Build the application:**
   ```bash
   npm run build
   ```
2. **Setup environment variables:**
   Copy `.env.example` (or the provided `.env`) and fill in your keys:
   ```bash
   cp .env.example .env
   # Edit .env with nano/vim
   ```
3. **Start the server:**
   You can run it directly:
   ```bash
   node server.js
   ```
   Or use PM2 to keep it alive:
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.cjs
   ```
