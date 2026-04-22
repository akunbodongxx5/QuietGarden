/**
 * Menjalankan Expo web dan otomatis menghidupkan lagi jika proses berhenti
 * (crash, Metro restart, dll). Ctrl+C = berhenti total tanpa loop.
 */
import { spawn } from 'node:child_process';
import process from 'node:process';

let child = null;
let stopping = false;

function run() {
  if (stopping) return;

  /** Pakai npm run agar PATH sama seperti di terminal proyek (Windows-friendly). */
  child = spawn('npm', ['run', 'preview'], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd(),
    env: { ...process.env },
  });

  child.on('exit', (code, signal) => {
    child = null;
    if (stopping) {
      process.exit(code ?? 0);
      return;
    }
    console.log(
      `\n[quiet-garden preview] Server berhenti (exit=${code}, signal=${signal}). Menghidupkan lagi dalam 2 detik…\n`
    );
    setTimeout(run, 2000);
  });

  child.on('error', (err) => {
    console.error('[quiet-garden preview]', err);
    if (!stopping) setTimeout(run, 3000);
  });
}

function shutdown() {
  stopping = true;
  if (child && !child.killed) {
    child.kill(process.platform === 'win32' ? undefined : 'SIGINT');
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

run();
