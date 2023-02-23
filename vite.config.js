import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'
import path, { resolve } from 'path'
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'),
                // login: resolve(__dirname, 'src/login.html'),
            },
        },
    },
    plugins: [glsl()],
})
