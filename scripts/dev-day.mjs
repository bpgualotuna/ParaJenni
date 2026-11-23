import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const day = Number(process.argv[2]);
if (!Number.isInteger(day) || day < 0 || day > 5) {
  console.error('Uso: npm run dev:day -- 0|1|2|3|4|5 [opciones de next dev]');
  process.exit(1);
}
const date = `2026-11-${22 + day}T12:00:00-05:00`;
const require = createRequire(import.meta.url);
console.log(`Vista de desarrollo: ${date} (America/Guayaquil). Producción ignora DEV_NOW.`);
const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'dev', ...process.argv.slice(3)], {
  stdio: 'inherit', env: { ...process.env, NODE_ENV: 'development', DEV_NOW: date },
});
child.on('exit', (code) => process.exit(code ?? 0));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
