# RealWorld API - NestJS

Este é um backend completo para um blog, seguindo a especificação do [RealWorld](https://realworld-docs.netlify.app/). Ele foi implementado utilizando **NestJS** e **TypeORM**, fornecendo autenticação, artigos, comentários e funcionalidade de seguir usuários.

## 🚀 Tecnologias Utilizadas

- **NestJS** - Framework para Node.js
- **TypeORM** - ORM para interação com o banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação segura
- **Swagger** - Documentação da API

## 📌 Funcionalidades Implementadas
### 🛠 Autenticação e Usuários
- [x] Registro de usuário
- [x] Login e geração de token JWT
- [x] Recuperação do usuário atual
- [x] Atualização dos dados do usuário

### 👥 Perfis e Seguidores
- [x] Obtenção de perfis de usuários
- [x] Seguir usuários
- [x] Deixar de seguir usuários

### 📝 Artigos
- [x] Listar artigos com filtros (tag, autor, favoritos)
- [x] Obter um artigo específico
- [x] Criar, atualizar e deletar artigos
- [x] Feed de artigos de usuários seguidos
- [x] Paginação na listagem de artigos

### 💬 Comentários
- [x] Adicionar comentários a um artigo
- [x] Listar comentários de um artigo
- [x] Remover comentários

### ⭐ Favoritos
- [x] Favoritar um artigo
- [x] Remover artigo dos favoritos
- [x] Contar quantos usuários favoritaram um artigo

### 🏷️ Tags

- [x] Listar todas as tags disponíveis



## 🛠 Configuração e Instalação

### **Pré-requisitos**
Certifique-se de ter instalado:
- Node.js (versão LTS recomendada)
- PostgreSQL
- Docker (opcional)

### **Passo a Passo**

1. Clone o repositório:
```sh
 git clone https://github.com/seu-usuario/realworld-nestjs.git
 cd realworld-nestjs
```

2. Instale as dependências:
```sh
 npm install
```

3. Crie um arquivo `.env` copiando o arquivo `.env.example` na raiz do projeto:
```sh
    cp .env.example .env
```
4. Inicie o servidor:
```sh
 npm run start:dev
```

A API estará rodando em `http://localhost:3000/`

## 📖 Documentação da API (Swagger)
Acesse a documentação interativa do Swagger em:
```
http://localhost:3000/api/docs
```

## 🧪 Testes
Para rodar os testes unitários:
```sh
npm run test
```
Para testes e2e:
```sh
npm run test:e2e
```

## 📂 Estrutura do Projeto
```
src/
 ├── auth/           
 ├── common/        
 ├── content/       
    ├── article
    ├── comment
 ├── costumer/ 
    ├── user/          
    ├── profile/ 
 ├── main.ts          
```

## 🔥 Próximos Passos
- [ ] Implementar cache para melhorar performance
- [ ] Adicionar testes de integração mais abrangentes
- [ ] Melhorar logging e monitoramento

## 📜 Licença
Este projeto é distribuído sob a licença MIT.

---
📌 **Dúvidas ou sugestões?** Sinta-se à vontade para contribuir ou abrir uma issue no repositório! 🚀

