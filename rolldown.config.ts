import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/background.ts",
  output: {
    dir: "dist",
    format: "esm",
  },
});
