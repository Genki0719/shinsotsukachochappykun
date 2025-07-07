# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Sharing Diagnosis Results

1. Start the backend server:

   ```bash
   node server.js
   ```

   The server stores diagnosis data in `results.json` and exposes `/results` endpoints.

2. Run the React dev server normally with `npm run dev`. The Vite proxy forwards requests to the backend.

3. After generating results in the app, click **共有リンクを作成** to save the data and get a URL of the form `/result/<id>`.

4. Share that link with others. Opening it displays the saved diagnosis in the same layout.
