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
  <title>BarberFlow API • Dark Gold Dashboard (5 Tabelas)</title>
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
      --green: #10b981;
      --green-bg: rgba(16, 185, 129, 0.15);
      --red: #ef4444;
      --red-bg: rgba(239, 68, 68, 0.15);
      --blue: #38bdf8;
      --blue-bg: rgba(56, 189, 248, 0.15);
      --purple: #a855f7;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
    
    body {
      background-color: var(--bg-dark);
      background-image: 
        radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.12) 0%, transparent 65%),
        radial-gradient(circle at 100% 100%, rgba(212, 175, 55, 0.08) 0%, transparent 45%);
      color: var(--text-main);
      padding: 28px 36px;
      min-height: 100vh;
    }

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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border-gold);
      border-radius: 16px;
      padding: 18px;
      position: relative;
      overflow: hidden;
      transition: all 0.25s ease;
    }

    .stat-card:hover {
      border-color: var(--border-gold-bright);
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(245, 158, 11, 0.2);
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
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .stat-value {
      font-size: 26px;
      font-weight: 800;
      color: var(--text-main);
      margin-top: 6px;
    }

    .content-grid {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-gold);
      border-radius: 16px;
      padding: 22px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .card-title {
      font-family: 'Cinzel', serif;
      font-size: 17px;
      font-weight: 700;
      color: var(--gold-primary);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .endpoint-tag {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 11px;
      font-weight: 700;
      color: var(--gold-primary);
      text-decoration: none;
      background: rgba(245, 158, 11, 0.1);
      padding: 5px 10px;
      border-radius: 8px;
      border: 1px solid var(--border-gold);
      transition: all 0.2s ease;
    }

    .endpoint-tag:hover {
      background: var(--gold-primary);
      color: #0a0a0d;
    }

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
      padding: 10px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(0, 0, 0, 0.2);
    }

    td {
      padding: 12px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 13px;
      color: var(--text-main);
      vertical-align: middle;
    }

    tr:hover td {
      background: var(--bg-card-hover);
    }

    .badge-status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 8px;
      border-radius: 16px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .status-agendado {
      color: var(--gold-primary);
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .status-concluido {
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
      font-size: 14px;
    }

    .two-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
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
        <div class="logo-text">BARBERFLOW REST API</div>
        <div class="subtitle">Modelo Relacional em 3ª Forma Normal • 5 Tabelas e Coleções Ativas</div>
      </div>
    </div>
    <div class="status-badge">
      <div class="status-dot"></div>
      <span>JSON-SERVER ATIVO (:3000)</span>
    </div>
  </div>

  <!-- 5 STAT CARDS NO TOPO -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">1. Agendamentos</div>
      <div class="stat-value" id="stat-agendamentos">-</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">2. Clientes (3FN)</div>
      <div class="stat-value" id="stat-clientes">-</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">3. Serviços</div>
      <div class="stat-value" id="stat-servicos">-</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">4. Profissionais</div>
      <div class="stat-value" id="stat-profissionais">-</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">5. Categorias</div>
      <div class="stat-value" id="stat-categorias">-</div>
    </div>
  </div>

  <!-- 5 TABLE CARDS COMPLETOS -->
  <div class="content-grid">
    <!-- CARD 1: AGENDAMENTOS -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">📅 1. Tabela Agendamentos (Tabela Central CRUD)</div>
        <a href="/agendamentos" target="_blank" class="endpoint-tag">GET /agendamentos ↗</a>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente (FK)</th>
              <th>Serviço (FK)</th>
              <th>Profissional (FK)</th>
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

    <!-- LINHA COM CARD 2 E CARD 3 -->
    <div class="two-cols">
      <!-- CARD 2: CLIENTES -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">👤 2. Tabela Clientes (Base Cadastral)</div>
          <a href="/clientes" target="_blank" class="endpoint-tag">GET /clientes ↗</a>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody id="tbl-clientes">
              <tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Carregando clientes...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CARD 3: SERVIÇOS -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">💈 3. Tabela Serviços (Catálogo)</div>
          <a href="/servicos" target="_blank" class="endpoint-tag">GET /servicos ↗</a>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Categoria (FK)</th>
                <th>Preço</th>
                <th>Duração</th>
              </tr>
            </thead>
            <tbody id="tbl-servicos">
              <tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Carregando serviços...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- LINHA COM CARD 4 E CARD 5 -->
    <div class="two-cols">
      <!-- CARD 4: PROFISSIONAIS -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">✂️ 4. Tabela Profissionais (Barbeiros)</div>
          <a href="/profissionais" target="_blank" class="endpoint-tag">GET /profissionais ↗</a>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Especialidade</th>
              </tr>
            </thead>
            <tbody id="tbl-profissionais">
              <tr><td colspan="3" style="text-align:center; color: var(--text-muted);">Carregando profissionais...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CARD 5: CATEGORIAS -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">🏷️ 5. Tabela Categorias (Classificação)</div>
          <a href="/categorias" target="_blank" class="endpoint-tag">GET /categorias ↗</a>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome da Categoria</th>
                <th>Ícone</th>
              </tr>
            </thead>
            <tbody id="tbl-categorias">
              <tr><td colspan="3" style="text-align:center; color: var(--text-muted);">Carregando categorias...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <script>
    async function loadData() {
      try {
        const [agRes, serRes, profRes, clRes, catRes] = await Promise.all([
          fetch('/agendamentos'),
          fetch('/servicos'),
          fetch('/profissionais'),
          fetch('/clientes'),
          fetch('/categorias')
        ]);

        const agendamentos = await agRes.json();
        const servicos = await serRes.json();
        const profissionais = await profRes.json();
        const clientes = await clRes.json();
        const categorias = await catRes.json();

        // Maps
        const serMap = {}; servicos.forEach(s => serMap[s.id] = s);
        const profMap = {}; profissionais.forEach(p => profMap[p.id] = p);
        const clMap = {}; clientes.forEach(c => clMap[c.id] = c);
        const catMap = {}; categorias.forEach(c => catMap[c.id] = c);

        // Stats
        document.getElementById('stat-agendamentos').innerText = agendamentos.length;
        document.getElementById('stat-clientes').innerText = clientes.length;
        document.getElementById('stat-servicos').innerText = servicos.length;
        document.getElementById('stat-profissionais').innerText = profissionais.length;
        document.getElementById('stat-categorias').innerText = categorias.length;

        // 1. Render Agendamentos
        const tblAg = document.getElementById('tbl-agendamentos');
        tblAg.innerHTML = agendamentos.map(a => {
          const cliente = clMap[a.clienteId] ? clMap[a.clienteId].nome : a.clienteNome || 'Cliente #' + a.clienteId;
          const tel = clMap[a.clienteId] ? clMap[a.clienteId].telefone : a.clienteTelefone || '';
          const servico = serMap[a.servicoId] ? serMap[a.servicoId].nome : 'Serviço #' + a.servicoId;
          const prof = profMap[a.profissionalId] ? profMap[a.profissionalId].nome : 'Profissional #' + a.profissionalId;
          const st = (a.status || 'agendado').toLowerCase();
          const statusClass = st === 'concluido' ? 'status-concluido' : (st === 'cancelado' ? 'status-cancelado' : 'status-agendado');

          return \`
            <tr>
              <td style="font-weight:700; color: var(--gold-primary)">#\${a.id}</td>
              <td><strong>\${cliente}</strong><br><small style="color:var(--text-muted)">\${tel}</small></td>
              <td>\${servico}</td>
              <td>\${prof}</td>
              <td>\${a.data}<br><small style="color:var(--text-muted)">\${a.hora}</small></td>
              <td><span class="badge-status \${statusClass}">\${st}</span></td>
              <td style="font-size: 12px; color: var(--text-muted)">\${a.observacoes || '-'}</td>
            </tr>
          \`;
        }).join('');

        // 2. Render Clientes
        const tblCl = document.getElementById('tbl-clientes');
        tblCl.innerHTML = clientes.map(c => \`
          <tr>
            <td style="font-weight:700; color: var(--blue)">#\${c.id}</td>
            <td><strong>\${c.nome}</strong></td>
            <td>\${c.telefone}</td>
            <td style="font-size:12px; color: var(--text-muted)">\${c.email || '-'}</td>
          </tr>
        \`).join('');

        // 3. Render Servicos
        const tblSe = document.getElementById('tbl-servicos');
        tblSe.innerHTML = servicos.map(s => {
          const cat = catMap[s.categoriaId] ? catMap[s.categoriaId].nome : 'Geral';
          return \`
            <tr>
              <td><strong>\${s.nome}</strong></td>
              <td><span style="font-size:11px; padding:2px 8px; border-radius:10px; background:rgba(245,158,11,0.1); color:var(--gold-primary)">\${cat}</span></td>
              <td><span class="price-tag">R$ \${(s.preco || 0).toFixed(2).replace('.', ',')}</span></td>
              <td>\${s.duracaoMinutos} min</td>
            </tr>
          \`;
        }).join('');

        // 4. Render Profissionais
        const tblPr = document.getElementById('tbl-profissionais');
        tblPr.innerHTML = profissionais.map(p => \`
          <tr>
            <td style="font-weight:700; color: var(--gold-primary)">#\${p.id}</td>
            <td><strong>\${p.nome}</strong></td>
            <td style="color: var(--text-muted)">\${p.especialidade}</td>
          </tr>
        \`).join('');

        // 5. Render Categorias
        const tblCat = document.getElementById('tbl-categorias');
        tblCat.innerHTML = categorias.map(c => \`
          <tr>
            <td style="font-weight:700; color: var(--purple)">#\${c.id}</td>
            <td><strong>\${c.nome}</strong></td>
            <td><code>\${c.icone || '-'}</code></td>
          </tr>
        \`).join('');

      } catch (err) {
        console.error('Erro ao carregar dados:', err);
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
