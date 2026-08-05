const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Intercepta GET / antes de qualquer middleware ou router do json-server
server.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BarberFlow API • Dark Gold Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0a0a0d;
      --bg-card: #121218;
      --bg-card-hover: #181824;
      --border-gold: rgba(212, 175, 55, 0.25);
      --border-gold-bright: rgba(245, 158, 11, 0.6);
      --gold-primary: #f59e0b;
      --gold-light: #fef3c7;
      --gold-metallic: linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #b45309 100%);
      --gold-gradient-text: linear-gradient(135deg, #fffbeb 0%, #f59e0b 50%, #d97706 100%);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --green: #10b981;
      --green-bg: rgba(16, 185, 129, 0.15);
      --red: #ef4444;
      --red-bg: rgba(239, 68, 68, 0.15);
      --blue: #3b82f6;
      --blue-bg: rgba(59, 130, 246, 0.15);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
    
    body {
      background-color: var(--bg-dark);
      background-image: 
        radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.08) 0%, transparent 60%),
        radial-gradient(circle at 100% 100%, rgba(212, 175, 55, 0.04) 0%, transparent 40%);
      color: var(--text-main);
      padding: 28px 36px;
      min-height: 100vh;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-gold);
      padding-bottom: 20px;
      margin-bottom: 28px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand-icon {
      width: 46px;
      height: 46px;
      border-radius: 12px;
      background: var(--gold-metallic);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
    }

    .logo-text {
      font-family: 'Cinzel', serif;
      font-size: 26px;
      font-weight: 800;
      background: var(--gold-gradient-text);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 2px;
    }

    .subtitle {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(18, 18, 24, 0.8);
      border: 1px solid var(--border-gold-bright);
      padding: 8px 16px;
      border-radius: 30px;
      font-size: 12px;
      font-weight: 700;
      color: var(--gold-light);
      box-shadow: 0 0 15px rgba(245, 158, 11, 0.15);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--green);
      box-shadow: 0 0 8px var(--green);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.8; }
    }

    /* Stat Cards Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border-gold);
      border-radius: 16px;
      padding: 20px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      border-color: var(--border-gold-bright);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: var(--gold-metallic);
    }

    .stat-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 800;
      color: var(--text-main);
      margin-top: 8px;
    }

    /* Main Sections Layout */
    .content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 28px;
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-gold);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .card-title {
      font-family: 'Cinzel', serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--gold-primary);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .endpoint-tag {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: var(--gold-primary);
      text-decoration: none;
      background: rgba(245, 158, 11, 0.1);
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid var(--border-gold);
      transition: all 0.2s ease;
    }

    .endpoint-tag:hover {
      background: rgba(245, 158, 11, 0.25);
      border-color: var(--gold-primary);
    }

    /* Tables */
    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    th {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1.2px;
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(0, 0, 0, 0.2);
    }

    td {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 14px;
      color: var(--text-main);
      vertical-align: middle;
    }

    tr:hover td {
      background: var(--bg-card-hover);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--border-gold);
    }

    .badge-status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-agendado, .status-pendente {
      color: var(--gold-primary);
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .status-concluido, .status-finalizado {
      color: var(--green);
      background: var(--green-bg);
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .status-cancelado {
      color: var(--red);
      background: var(--red-bg);
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .price-tag {
      color: var(--gold-primary);
      font-weight: 700;
      font-size: 15px;
    }

    .duration-tag {
      color: var(--text-muted);
      font-size: 13px;
    }

    .two-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
    }

    @media (max-width: 900px) {
      .two-cols { grid-template-columns: 1fr; }
      body { padding: 16px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <div class="brand-icon">✂</div>
      <div>
        <div class="logo-text">BARBERFLOW PREMIUM</div>
        <div class="subtitle">Servidor REST High-Performance • Interceptador Root HTTP /</div>
      </div>
    </div>
    <div class="status-badge">
      <div class="status-dot"></div>
      <span>JSON-SERVER ONLINE (:3000)</span>
    </div>
  </div>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">Agendamentos Totais</div>
      <div class="stat-value" id="stat-agendamentos">-</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Serviços Ativos</div>
      <div class="stat-value" id="stat-servicos">-</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Profissionais</div>
      <div class="stat-value" id="stat-profissionais">-</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Ticket Médio</div>
      <div class="stat-value" id="stat-ticket">R$ 0,00</div>
    </div>
  </div>

  <div class="content-grid">
    <!-- AGENDAMENTOS -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">📅 Agendamentos Recentes</div>
        <a href="/agendamentos" target="_blank" class="endpoint-tag">GET /agendamentos ↗</a>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Serviço</th>
              <th>Profissional</th>
              <th>Data & Hora</th>
              <th>Status</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody id="tbl-agendamentos">
            <tr><td colspan="7" style="text-align:center; color: var(--text-muted);">Carregando agendamentos...</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="two-cols">
      <!-- SERVIÇOS -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">💈 Catálogo de Serviços</div>
          <a href="/servicos" target="_blank" class="endpoint-tag">GET /servicos ↗</a>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Preço</th>
                <th>Duração</th>
              </tr>
            </thead>
            <tbody id="tbl-servicos">
              <tr><td colspan="3" style="text-align:center; color: var(--text-muted);">Carregando serviços...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- PROFISSIONAIS -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">✂ Profissionais</div>
          <a href="/profissionais" target="_blank" class="endpoint-tag">GET /profissionais ↗</a>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Profissional</th>
                <th>Especialidade</th>
              </tr>
            </thead>
            <tbody id="tbl-profissionais">
              <tr><td colspan="2" style="text-align:center; color: var(--text-muted);">Carregando profissionais...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <script>
    async function loadData() {
      try {
        const [agRes, serRes, profRes] = await Promise.all([
          fetch('/agendamentos'),
          fetch('/servicos'),
          fetch('/profissionais')
        ]);

        const agendamentos = await agRes.json();
        const servicos = await serRes.json();
        const profissionais = await profRes.json();

        // Maps for quick lookup
        const serMap = {};
        servicos.forEach(s => serMap[s.id] = s);
        const profMap = {};
        profissionais.forEach(p => profMap[p.id] = p);

        // Render Stats
        document.getElementById('stat-agendamentos').innerText = agendamentos.length;
        document.getElementById('stat-servicos').innerText = servicos.length;
        document.getElementById('stat-profissionais').innerText = profissionais.length;

        if (servicos.length > 0) {
          const totalPreco = servicos.reduce((acc, curr) => acc + (curr.preco || 0), 0);
          const media = totalPreco / servicos.length;
          document.getElementById('stat-ticket').innerText = 'R$ ' + media.toFixed(2).replace('.', ',');
        }

        // Render Agendamentos
        const tblAgendamentos = document.getElementById('tbl-agendamentos');
        if (agendamentos.length === 0) {
          tblAgendamentos.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-muted)">Nenhum agendamento encontrado</td></tr>';
        } else {
          tblAgendamentos.innerHTML = agendamentos.map(a => {
            const servico = serMap[a.servicoId] ? serMap[a.servicoId].nome : 'Serviço #' + a.servicoId;
            const prof = profMap[a.profissionalId] ? profMap[a.profissionalId].nome : 'Profissional #' + a.profissionalId;
            const st = (a.status || 'agendado').toLowerCase();
            const statusClass = st === 'concluido' ? 'status-concluido' : (st === 'cancelado' ? 'status-cancelado' : 'status-agendado');

            return \`
              <tr>
                <td style="font-weight:700; color: var(--gold-primary)">#\${a.id}</td>
                <td>
                  <div style="font-weight: 600;">\${a.clienteNome}</div>
                  <div style="font-size: 12px; color: var(--text-muted)">\${a.clienteTelefone || ''}</div>
                </td>
                <td>\${servico}</td>
                <td>\${prof}</td>
                <td>\${a.data}<br><small style="color:var(--text-muted)">\${a.hora}</small></td>
                <td><span class="badge-status \${statusClass}">\${st}</span></td>
                <td style="font-size: 12px; color: var(--text-muted)">\${a.observacoes || '-'}</td>
              </tr>
            \`;
          }).join('');
        }

        // Render Servicos
        const tblServicos = document.getElementById('tbl-servicos');
        tblServicos.innerHTML = servicos.map(s => \`
          <tr>
            <td>
              <div style="font-weight: 700;">\${s.nome}</div>
              <div style="font-size: 12px; color: var(--text-muted)">\${s.descricao || ''}</div>
            </td>
            <td><span class="price-tag">R$ \${(s.preco || 0).toFixed(2).replace('.', ',')}</span></td>
            <td><span class="duration-tag">⏱ \${s.duracaoMinutos} min</span></td>
          </tr>
        \`).join('');

        // Render Profissionais
        const tblProfissionais = document.getElementById('tbl-profissionais');
        tblProfissionais.innerHTML = profissionais.map(p => \`
          <tr>
            <td>
              <div class="user-info">
                <img src="\${p.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}" class="avatar" alt="\${p.nome}" />
                <div>
                  <div style="font-weight: 700;">\${p.nome}</div>
                  <div style="font-size: 11px; color: var(--gold-primary)">ID: \${p.id}</div>
                </div>
              </div>
            </td>
            <td><span style="font-size: 13px; color: var(--text-main)">\${p.especialidade}</span></td>
          </tr>
        \`).join('');

      } catch (err) {
        console.error('Erro ao carregar dados do servidor:', err);
      }
    }

    loadData();
  </script>
</body>
</html>
  `);
});

server.use(middlewares);
server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`BarberFlow Server rodando em http://localhost:${PORT}`);
});
