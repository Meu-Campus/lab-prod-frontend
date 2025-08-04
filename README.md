# Meu Campus Frontend

Este é o projeto frontend do Meu Campus, desenvolvido com [Next.js](https://nextjs.org/).

## Começando

Siga estas instruções para ter uma cópia do projeto rodando em sua máquina local para desenvolvimento e testes.

### Pré-requisitos

Você vai precisar do [Node.js](https://nodejs.org/) (versão 20.x ou superior) e um gerenciador de pacotes como [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/).

### Variáveis de Ambiente

Antes de rodar a aplicação, você precisa criar um arquivo `.env.local` na raiz do projeto. Você pode copiar o exemplo abaixo:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_API_KEY=
```

**Nota:** A `NEXT_PUBLIC_API_KEY` deve ser obtida com um administrador do sistema.

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/Meu-Campus/lab-prod-frontend.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd meu-campus-frontend
   ```
3. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

### Rodando a Aplicação

Após a instalação, você pode rodar o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) em seu navegador para ver o resultado.