const { spawn } = require('child_process');
const path = require('path');

console.log('\x1b[33m%s\x1b[0m', '💈 [BarberFlow] Iniciando ecossistema completo (API + Expo Web)...');

// 1. Iniciar o servidor Backend Mock (json-server / server.js)
const serverProcess = spawn('node', ['server.js'], {
  stdio: 'inherit',
  shell: true,
});

// 2. Iniciar o Expo Web
const expoProcess = spawn('npx', ['expo', 'start', '--web'], {
  stdio: 'inherit',
  shell: true,
});

// Tratamento de encerramento
process.on('SIGINT', () => {
  console.log('\n\x1b[33m%s\x1b[0m', '💈 [BarberFlow] Encerrando serviços...');
  serverProcess.kill('SIGINT');
  expoProcess.kill('SIGINT');
  process.exit(0);
});
