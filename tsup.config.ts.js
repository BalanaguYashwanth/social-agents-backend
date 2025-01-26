import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/server.ts"],
    outDir: "dist",
    sourcemap: true,
    clean: true,
    format: ["cjs", "esm"],      // Ensure you're targeting CommonJS
    external: [
        "dotenv", // Externalize dotenv to prevent bundling
        "fs", // Externalize fs to use Node.js built-in module
        "path", // Externalize other built-ins if necessary
        "@reflink/reflink",
        "@node-llama-cpp",
        "https",
        "http",
        "agentkeepalive",
        "safe-buffer",
        "bundle-require",
        "tinyexec",
        "tinyglobby",
        "tree-kill",
        "esbuild",
        "consola",
        "sucrase",
        "source-map",
        "rollup",
        "typescript",
        "chokidar",
        "picocolors",
        // Add other modules you want to externalize
    ],
});
