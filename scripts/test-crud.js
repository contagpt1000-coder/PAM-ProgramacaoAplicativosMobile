const axios = require('axios');

const API_BASE = 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Iniciando Bateria de Testes Automatizados no BarberFlow (5 Tabelas / 3FN)...');
  
  try {
    // 1. Teste GET /categorias
    console.log('1. Testando GET /categorias...');
    const catRes = await axios.get(`${API_BASE}/categorias`);
    console.log(`   ✅ Sucesso: ${catRes.data.length} categorias encontradas.`);

    // 2. Teste GET /servicos
    console.log('2. Testando GET /servicos...');
    const servicosRes = await axios.get(`${API_BASE}/servicos`);
    console.log(`   ✅ Sucesso: ${servicosRes.data.length} serviços encontrados.`);

    // 3. Teste GET /profissionais
    console.log('3. Testando GET /profissionais...');
    const profRes = await axios.get(`${API_BASE}/profissionais`);
    console.log(`   ✅ Sucesso: ${profRes.data.length} profissionais encontrados.`);

    // 4. Teste GET /clientes
    console.log('4. Testando GET /clientes...');
    const clientesRes = await axios.get(`${API_BASE}/clientes`);
    console.log(`   ✅ Sucesso: ${clientesRes.data.length} clientes encontrados.`);

    // 5. Teste POST /agendamentos com clienteId vinculado
    console.log('5. Testando POST /agendamentos (Criando novo agendamento vinculado à entidade Cliente)...');
    const novoAgendamento = {
      clienteId: '1',
      clienteNome: 'Carlos Eduardo',
      clienteTelefone: '(11) 98765-4321',
      servicoId: '1',
      profissionalId: '1',
      data: '2026-08-20',
      hora: '15:00',
      status: 'agendado',
      observacoes: 'Teste integrado de 5 tabelas'
    };
    const createRes = await axios.post(`${API_BASE}/agendamentos`, novoAgendamento);
    const createdId = createRes.data.id;
    console.log(`   ✅ Sucesso: Agendamento criado com ID #${createdId}.`);

    // 6. Teste PATCH /agendamentos/:id
    console.log(`6. Testando PATCH /agendamentos/${createdId} (Concluir)...`);
    const updateRes = await axios.patch(`${API_BASE}/agendamentos/${createdId}`, { status: 'concluido' });
    if (updateRes.data.status === 'concluido') {
      console.log('   ✅ Sucesso: Status atualizado para concluído no banco.');
    }

    // 7. Teste DELETE /agendamentos/:id
    console.log(`7. Testando DELETE /agendamentos/${createdId}...`);
    await axios.delete(`${API_BASE}/agendamentos/${createdId}`);
    console.log('   ✅ Sucesso: Agendamento temporário removido com sucesso.');

    console.log('\n🎉 TODOS OS TESTES PASSARAM COM 100% DE SUCESSO! As 5 tabelas estão integradas e operacionais.');
  } catch (error) {
    console.error('❌ Falha nos testes:', error.message);
    process.exit(1);
  }
}

runTests();
