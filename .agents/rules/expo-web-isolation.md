# Expo Web Layout & Scroll Isolation Rules

1. **Asset & HTML Template Isolation**:
   - **NUNCA** crie arquivos `index.html` dentro da pasta `./public` em projetos Expo SDK 50+ para evitar sobrescrever a injeção do `AppEntry.js`.
   - Sempre utilize um script dedicado `server.js` (Node Express Middleware) para servir dashboards customizados do `json-server` na porta 3000.

2. **Container de Rolagem Único (Single Scroll Container)**:
   - **NUNCA** aplique `overflow-y: auto !important` no `html, body` ou `#root` se as telas do app usarem `ScrollView` ou `FlatList`. Mantenha `html, body, #root { height: 100%; overflow: hidden; }` para evitar barras de rolagem duplas e trepidação visual (shaking/flickering).
   - Evite botões fixos com `position: fixed` concorrendo com o fluxo normal de formulários scrolláveis.

3. **Preenchimento de Largura Responsiva em Desktop (Full Width Layout)**:
   - Em layouts para PC/Desktop, a aplicação deve preencher `width: 100%` da tela com preenchimento lateral fluido (`paddingHorizontal: 24`), sem impor contêineres estreitos centralizados (`maxWidth: 900px`) com grandes margens pretas laterais.
