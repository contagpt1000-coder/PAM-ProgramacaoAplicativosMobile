---
name: jetpack-compose-ui
description: UI Android moderna com Jetpack Compose, gerenciamento de estado (State Hoisting, Unidirectional Data Flow), Material 3, animações e composição performática.
---

# Jetpack Compose UI

Esta skill guia a construção de interfaces declarativas modernas para Android nativo utilizando Jetpack Compose e Material Design 3.

## Princípios de UI Declarativa

### 1. Elevação de Estado (State Hoisting)
- Mantenha funções `@Composable` stateless sempre que possível, passando o estado atual e callbacks de eventos via parâmetros.
- Utilize o fluxo unidirecional de dados (Unidirectional Data Flow - UDF): Estado desce, eventos sobem.

### 2. Otimização de Recomposição
- Marque classes de dados complexas como `@Immutable` ou `@Stable` para evitar recomposições desnecessárias.
- Utilize `remember` para preservar valores entre recomposições e `derivedStateOf` para estados derivados de coleções mutáveis.

### 3. Material 3 e Cores Dinâmicas
- Aplique tokens do Material Design 3 via `MaterialTheme.colorScheme` e `MaterialTheme.typography`.
- Suporte a Dynamic Color no Android 12+ mantendo fallbacks limpos para versões anteriores.

### 4. Layouts Performáticos
- Utilize `LazyColumn` e `LazyRow` para listas longas em vez de `Column`/`Row` com scroll manual.
- Forneça `contentType` e `key` únicos para itens de lista para otimizar o reaproveitamento de composables.
