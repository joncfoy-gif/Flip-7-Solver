import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isGhPages = mode === "production";
  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
  return {
    plugins: [react()],
    base: isGhPages && repoName ? `/${repoName}/` : "/"
  };
});
