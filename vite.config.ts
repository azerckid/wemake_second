import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    host: true, // 모든 네트워크 인터페이스에서 접근 허용
    allowedHosts: [
      "localhost",
      ".trycloudflare.com", // Cloudflare Tunnel 호스트 허용
    ],
    watch: {
      ignored: [
        "**/node_modules/**",
        "**/.git/**",
        "**/dist/**",
        "**/build/**",
        "**/.cache/**",
        "**/.playwright-mcp/**",
      ],
      // macOS EMFILE 에러 해결을 위한 설정 (기본값 유지)
      usePolling: false,
    },
    fs: {
      // 파일 시스템 제한 완화
      strict: false,
    },
  },
});
