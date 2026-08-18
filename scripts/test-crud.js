const axios = require('axios');

const API_BASE = 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Iniciando Bateria de Testes Automatizados no BarberFlow...');
  
  try {
    // 1. Teste GET /servicos
    console.log('1. Testando GET /servicos...');
    const servicosRes = await axios.get(`${API_BASE}/servicos`);
    console.log(`   ✅ Sucesso: ${servicosRes.data.length} serviços encontrados.`);

    // 2. Teste GET /profissionais
    console.log('2. Testando GET /profissionais...');
    const profRes = await axios.get(`${API_BASE}/profissionais`);
    console.log(`   ✅ Sucesso: ${profRes.data.length} profissionais encontrados.`);

    // 3. Teste POST /agendamentos (Criação no banco)
    console.log('3. Testando POST /agendamentos (Criando novo agendamento no banco de dados)...');
    const novoAgendamento = {
      clienteNome: 'Cliente Teste Integrado',
      clienteTelefone: '(11) 98765-4321',
      servicoId: '1',
      profissionalId: '1',
      data: '2026-08-20',
      hora: '14:00',
      status: 'agendado',
      observacoes: 'Criado pelo teste automatizado de integridade'
    };
    const createRes = await axios.post(`${API_BASE}/agendamentos`, novoAgendamento);
    const createdId = createRes.data.id;
    console.log(`   ✅ Sucesso: Agendamento criado com ID #${createdId}.`);

    // 4. Teste GET /agendamentos/:id
    console.log(`4. Testando GET /agendamentos/${createdId}...`);
    const getRes = await axios.get(`${API_BASE}/agendamentos/${createdId}`);
    if (getRes.data.clienteNome === novoAgendamento.clienteNome) {
      console.log('   ✅ Sucesso: Dados recuperados correspondem aos dados inseridos.');
    } else {
      throw new Error('Dados recuperados divergentes!');
    }

    // 5. Teste PATCH /agendamentos/:id (Concluir)
    console.log(`5. Testando PATCH /agendamentos/${createdId} (Marcando como concluído)...`);
    const updateRes = await axios.patch(`${API_BASE}/agendamentos/${createdId}`, { status: 'concluido' });
    if (updateRes.data.status === 'concluido') {
      console.log('   ✅ Sucesso: Status atualizado para concluído no banco.');
    } else {
      throw new Error('Falha ao atualizar status!');
    }

    // 6. Teste DELETE /agendamentos/:id (Remoção)
    console.log(`6. Testando DELETE /agendamentos/${createdId}...`);
    await axios.delete(`${API_BASE}/agendamentos/${createdId}`);
    console.log('   ✅ Sucesso: Agendamento removido com sucesso.');

    // Verificar se foi removido mesmo
    try {
      await axios.get(`${API_BASE}/agendamentos/${createdId}`);
      throw new Error('O agendamento ainda existe após DELETE!');
    } catch (e) {
      if (e.response && e.response.status === 404) {
        console.log('   ✅ Sucesso: Confirmação de 404 Not Found após deleção.');
      } else {
        throw e;
      }
    }

    console.log('\n🎉 TODOS OS TESTES PASSARAM COM 100% DE SUCESSO! A API e o Banco de Dados estão totalmente operacionais.');
  } catch (error) {
    console.error('❌ Falha nos testes:', error.message);
    process.exit(1);
  }
}

runTests();
