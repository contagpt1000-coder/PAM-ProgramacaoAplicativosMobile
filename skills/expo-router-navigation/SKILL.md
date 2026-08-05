---
name: expo-router-navigation
description: Navegação baseada em arquivos e rotas tipadas com Expo Router (Tabs, Stacks, Modals, Deep Linking, Authentication Flows e layout nesting em React Native).
---

# Expo Router Navigation

Esta skill define os padrões de navegação e roteamento baseados em sistema de arquivos utilizando Expo Router no React Native.

## Padrões de Navegação

### 1. Estrutura de Arquivos de Rota (`app/`)
- Mantenha a estrutura alinhada com as telas da aplicação:
```
app/
├── (auth)/         # Grupo de rotas de autenticação
│   ├── login.tsx
│   └── register.tsx
├── (main)/         # Grupo principal protegido
│   ├── _layout.tsx # Layout de Tabs/Drawer
│   ├── index.tsx   # Tela inicial (Home)
│   └── settings.tsx
├── _layout.tsx     # Root Layout com provedores e Stack global
└── modal.tsx       # Rota apresentada como Modal
```

### 2. Rotas Tipadas e Navegação Declarativa
- Utilize `<Link href="/details/123">` ou o hook `useRouter()` para navegação programática tipada.
- Defina parâmetros de rota com nomes descritivos em arquivos dinâmicos (ex: `[id].tsx`).

### 3. Proteção de Rotas e Telas de Autenticação
- Implemente verificações no `_layout.tsx` para redirecionar usuários não autenticados utilizando `<Redirect href="/login" />`.
