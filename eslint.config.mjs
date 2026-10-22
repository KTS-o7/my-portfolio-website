import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  // .claude/: the whiteboard-html skill (build tooling and vendored rough.js / ELK), not site code
  { ignores: [".next/**", "node_modules/**", ".claude/**"] },
  ...nextCoreWebVitals,
];

export default config;
