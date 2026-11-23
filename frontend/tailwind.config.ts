import type { Config } from 'tailwindcss';
const config: Config = { content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { ink: '#18231f', forest: '#245b48', mint: '#e9f3ed', sand: '#f7f6f1' }, boxShadow: { soft: '0 14px 45px rgba(24,35,31,.08)' } } }, plugins: [] };
export default config;
