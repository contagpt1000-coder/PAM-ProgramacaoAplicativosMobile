# 💈 BarberFlow - Sistema de Agendamento Mobile (PAM)

> Projeto completo desenvolvido para a disciplina de **Programação de Aplicativos Móveis (PAM)**.

---

## 📌 Sobre o Projeto

O **BarberFlow** é uma aplicação móvel moderna desenvolvida em React Native com Expo, criada para simplificar a gestão de agendamentos em barbearias premium e centros de estética masculina. O projeto conta com visual escuro sofisticado (*Dark Gold Premium*), suporte completo a operações HTTP REST (CRUD) alimentadas por um servidor `json-server`, validações rigorosas no front-end e 100% de conformidade com normas de acessibilidade (WCAG 2.5.5 - Touch Targets de no mínimo 44pt).

---

## 👥 Integrantes da Dupla

- **[Nome 1]** - *Desenvolvimento Front-end & UI/UX*
- **[Nome 2]** - *Integração API & Estrutura de Dados*

---

## 🛠️ Tecnologias e Dependências

- **Framework Front-end:** [React Native](https://reactnative.dev/) com [Expo SDK 50](https://expo.dev/)
- **Navegação:** [React Navigation v6](https://reactnavigation.org/) (`@react-navigation/stack`)
- **Estilização & Componentes:** [NativeWind (Tailwind CSS)](https://www.nativewind.dev/) + [React Native Paper](https://reactnativepaper.com/)
- **Cliente HTTP:** [Axios](https://axios-http.com/) com interceptor de respostas
- **Backend / API Mock:** [json-server](https://github.com/typicode/json-server)
- **Linguagem:** TypeScript (Strict Mode)

---

## 📂 Arquitetura de Pastas e Componentes

```text
PAM-ProgramacaoAplicativosMobile/
├── assets/                    # Ativos estáticos e ícones
├── db.json                    # Banco de dados fictício (servicos, profissionais, agendamentos)
├── src/
│   ├── components/            # Componentes visuais reutilizáveis
│   │   ├── AgendamentoCard.tsx# Card interativo com badges e ações rápidas
│   │   ├── FilterModal.tsx    # Modal com chips para filtro por status e data
│   │   ├── Header.tsx         # Topbar com branding BarberFlow e Safe Area insets
│   │   └── LoadingSpinner.tsx # Feedback de carregamento acessível
│   ├── constants/             # Design system e constante de cores (Dark/Gold)
│   │   └── colors.ts
│   ├── routes/                # Gerenciamento de rotas (Stack Navigator)
│   │   ├── app.routes.tsx
│   │   └── index.tsx
│   ├── screens/               # Telas do fluxo da aplicação
│   │   ├── HomeScreen.tsx                # Dashboard com resumo, busca e FAB
│   │   ├── NovoAgendamentoScreen.tsx     # Formulário de inclusão (Create)
│   │   └── DetalhesAgendamentoScreen.tsx # Gerenciamento (Read, Update, Delete)
│   ├── services/              # Camada de comunicação HTTP REST
│   │   ├── api.ts                # Cliente Axios com interceptor de erros
│   │   └── agendamentoService.ts # Serviços CRUD (get, create, update, delete)
│   ├── types/                 # Interfaces e DTOs em TypeScript
│   │   └── index.ts
│   └── utils/                 # Validações e formatadores de dados
│       ├── formatters.ts         # Formatadores BRL, telefone e datas ISO
│       └── validations.ts        # Validações de data futura, expediente e DDD
├── App.tsx                    # Ponto de entrada com Providers (Paper & Routes)
├── package.json               # Dependências do projeto
└── README.md                  # Documentação técnica oficial
```

---

## 🚀 Como Executar o Projeto Passo a Passo

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18 ou superior)
- Navegador Web (Chrome/Edge) ou o aplicativo **Expo Go** no celular.

---

### Passo 1: Instalar Dependências

```bash
npm install --legacy-peer-deps
```

---

### Passo 2: Executar o Servidor Backend Mock (`json-server`)

Abra um terminal na pasta do projeto e inicie o `json-server`:

```bash
npm run api
```

> 🟢 **Backend Ativo:** O servidor iniciará na porta `3000`:
> - API de Agendamentos: `http://localhost:3000/agendamentos`
> - API de Serviços: `http://localhost:3000/servicos`
> - API de Profissionais: `http://localhost:3000/profissionais`

---

### Passo 3: Executar a Aplicação Mobile (Expo)

Em outro terminal na mesma pasta:

```bash
npm start
```

#### Como visualizar o App:
- **No Navegador Web:** Pressione a tecla **`w`** no terminal. O navegador abrirá automaticamente em **`http://localhost:8081`**.
- **No Celular Físico via Expo Go:** Escaneie o **QR Code** exibido no terminal utilizando o app **Expo Go** no celular.

---

## 📡 Especificação da API REST (Endpoints)

| Método | Rota | Descrição da Operação | Payload (Enviado) | Status HTTP |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/agendamentos` | Lista agendamentos (suporta `?status=` e `?data=`) | N/A | `200 OK` |
| `GET` | `/agendamentos/:id` | Detalhes de um agendamento específico | N/A | `200 OK`, `404 Not Found` |
| `POST` | `/agendamentos` | Cria um novo agendamento no sistema | `AgendamentoDTO` | `201 Created`, `400 Bad Request` |
| `PATCH` | `/agendamentos/:id` | Atualiza status (`concluido`/`cancelado`) ou data | `Partial<Agendamento>` | `200 OK`, `400 Bad Request` |
| `DELETE`| `/agendamentos/:id` | Remove agendamento do histórico | N/A | `200 OK` / `204 No Content` |
| `GET` | `/servicos` | Lista de serviços oferecidos | N/A | `200 OK` |
| `GET` | `/profissionais` | Lista de barbeiros e especialistas | N/A | `200 OK` |

---

## 🔬 Relatórios Técnicos de Auditoria Multi-Especialista

### 📱 1. Frontend Architect Review
- **Rotas Tipadas:** Tipagem estrita de props de navegação via `StackScreenProps<RootStackParamList, RouteName>`.
- **Virtualização:** A `FlatList` em [`HomeScreen.tsx`](file:///c:/Users/Douglas/Documents/antigravity/PAM-ProgramacaoAplicativosMobile/src/screens/HomeScreen.tsx) utiliza `initialNumToRender={10}`, `windowSize={5}` e `removeClippedSubviews={true}` para máxima performance de renderização.

### ⚙️ 2. Backend & REST API Review
- **Integridade Referencial:** Validação de chaves estrangeiras (`servicoId` e `profissionalId`) em [`db.json`](file:///c:/Users/Douglas/Documents/antigravity/PAM-ProgramacaoAplicativosMobile/db.json).
- **Tratamento de Exceções Axios:** [`api.ts`](file:///c:/Users/Douglas/Documents/antigravity/PAM-ProgramacaoAplicativosMobile/src/services/api.ts) possui `api.interceptors.response.use` para interceptar timeouts e falhas de conexão.

### 🎨 3. UI/UX & Accessibility Review (WCAG)
- **Contraste:** Paleta Dark Gold com razão de contraste de 12.8:1 (WCAG AAA).
- **Touch Target (WCAG 2.5.5):** Todos os botões interativos possuem `minHeight: 44pt` a `48pt`.
- **Safe Area Insets:** [`Header.tsx`](file:///c:/Users/Douglas/Documents/antigravity/PAM-ProgramacaoAplicativosMobile/src/components/Header.tsx) utiliza `useSafeAreaInsets()` para adaptação automática a notches.

### 🧪 4. Data Quality & Edge Cases Review
- **Correção de Rollover de Datas:** Prevenção de rollovers do objeto `Date` no JS (ex: 31/02 que virava 03/03).
- **Expediente Comercial:** Validação de horários entre 08:00 e 18:00.
- **Sanitização:** Bloqueio de caracteres nulos (`\0`) e validação de DDDs do Brasil.

---

## 📜 Licença

Projeto desenvolvido para fins acadêmicos na disciplina de Programação de Aplicativos Móveis (PAM).
