# Expo Web & JSON-Server Static Asset Isolation Rule

- **NUNCA** crie um arquivo `index.html` dentro da pasta `./public` de um projeto Expo/React Native quando houver um servidor `json-server` ou similar coexistindo na mesma raiz.
- **Motivo:** O Expo CLI (SDK 50+) utiliza a pasta `./public/index.html` como modelo de template Web principal da aplicação móvel. Criar um HTML customizado para o `json-server` ali substitui o template do aplicativo, fazendo a porta do Expo (8081) servir o HTML da API em vez da aplicação React Native.
- **Solução Padronizada:** Para personalizar ou estilizar a página do `json-server`, crie um script customizado `server.js` via Node.js (utilizando o pacote `json-server` como middleware do Express) que sirva o HTML desejado diretamente na rota raiz (`GET /`) da porta 3000, mantendo o diretório de pastas do Expo intacto e limpo.
