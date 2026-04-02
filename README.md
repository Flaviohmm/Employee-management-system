# 👔 Employee Management System

Sistema completo de gerenciamento de funcionários com **backend em Spring Boot** e **frontend moderno em React + Vite + Tailwind CSS**.

Projeto desenvolvido para demonstrar habilidades em **Análise de Sistemas** e desenvolvimento **Full Stack**, ideal para portfólio de vagas de Analista de Sistemas, Desenvolvedor Backend Java ou Full Stack Júnior/Pleno.

## ✨ Funcionalidades

### Backend (Spring Boot)
- CRUD completo de funcionários (Create, Read, Update, Delete)
- Busca por nome ou e-mail
- Filtros por departamento e cargo
- Paginação e ordenação
- Validações de dados (Bean Validation)
- Tratamento de exceções personalizado
- Integração com banco de dados relacional (MySQL / PostgreSQL)

### Frontend (React + Vite + Tailwind CSS)
- Interface moderna, responsiva e clean
- Tabela com paginação, busca e filtros
- Modal para cadastro e edição de funcionários
- Confirmação de exclusão
- Design profissional com Tailwind CSS
- Comunicação com API via Axios

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 17 ou 21 ou 25**
- **Spring Boot 3.3+**
- Spring Data JPA + Hibernate
- Spring Web (REST APIs)
- Lombok
- Bean Validation
- MySQL / PostgreSQL

### Frontend
- **React + TypeScript** (ou JavaScript)
- **Vite** (build tool)
- **Tailwind CSS**
- Axios
- Lucide React (ícones)
- React Router (navegação)
- React Hook Form + Zod (validação de formulários - opcional)

### Outras ferramentas
- Git + GitHub
- Postman (testes de API)
- Docker (opcional)

## 📁 Estrutura do Projeto

```
employee-management-system/
├── backend/                  # Projeto Spring Boot (Maven)
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── pom.xml
│
├── frontend/                 # Projeto React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── README.md
└── .gitignore
```

## 🚀 Como Executar o Projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/Flaviohmm/Employee-management-system.git
cd employee-management-system
```

### 2. Backend (Spring Boot)
```bash
cd backend

# Configure o banco de dados em src/main/resources/application.yml
# (altere url, username e password conforme seu ambiente)

# Rode o projeto
./mvnw spring-boot:run
```

O backend estará disponível em: http://localhost:8080


### 3. Frontend (React + Vite)
```bash
cd frontend

# Instale as dependências
npm install

# Rode o frontend
npm run dev
```

O frontend estará disponível em: http://localhost:5173

> Importante: Ative o CORS no backend ou configure o proxy no Vite se necessário.

## 📸 Screenshots

(Adicione aqui prints da tela de listagem, modal de cadastro e dashboard quando tiver)

## 🧪 APIs Principais



|Método | Endpoint | Descrição
|---|---|---|
|GET | ```/api/employees``` | Listar funcionários (com paginação e filtros)
|GET|```/api/employees/{id}```|Buscar por ID
|POST|```/api/employees```|Criar novo funcionário
|PUT|```/api/employees/{id}```|Atualizar funcionário
|DELETE|```/api/employees/{id}```|Deletar funcionário

## 📋 Requisitos Funcionais

- Cadastro de funcionários com dados completos (nome, email, departamento, cargo, salário, data de contratação)
- Listagem com busca e filtros
- Edição e exclusão de registros
- Interface intuitiva e responsiva

## 🎯 Objetivos do Projeto (para portfólio)

- Demonstrar levantamento de requisitos e modelagem de dados
- Desenvolvimento de APIs RESTful
- Integração frontend ↔ backend
- Boas práticas de código (clean code, validações, tratamento de erros)
- Uso de tecnologias modernas e demandadas no mercado


## 📄 Licença
Este projeto é para fins educacionais e de portfólio. Sinta-se à vontade para estudar, forkar e melhorar.

---

**Feito com ❤️ por Flavio Macedo**

Analista de Sistemas | Java + Spring Boot | React + Tailwind