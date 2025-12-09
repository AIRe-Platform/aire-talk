import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    ],
    server: {
        port: 8080
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'aire': fileURLToPath(new URL('./submodules/aire-typescript-sdk/src', import.meta.url))
        }
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: manualChunks
            }
        }
    }
})

function manualChunks(id) {
    if (id.includes('node_modules'))
        return 'vendor';

    if (id.includes('aire-typescript-sdk'))
        return 'aire';

    return null;
}
