import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reviewsDevApi from "./tools/reviews-dev-api.mjs";
export default defineConfig({
  plugins: [react(), reviewsDevApi()],
  server: { host: "0.0.0.0", port: 5173 },
  preview: { port: 4173 },
});
