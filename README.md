# Projeto API para mini e-commerce.

O projeto foi desenvolvido para aplicação de conhecimentos adiquiridos durante a faculdade e estudos pessoais. <br/>

Essa aplicação é uma das partes do projeto mini e-commerce que estou projetando. Em especifíco, o back-end. <br/>
A aplicação pode registrar/manejar usuários, ordens e seus itens, produtos e categorias.

![node-js-736399_1920](https://github.com/AlexSnider/Projeto-API-e-commerce-Node.js/assets/103783575/18da5724-9985-4320-ae21-800a2ebfb092)

Node.js® is an open-source, cross-platform JavaScript runtime environment.


## Pré-requisitos:

* Windows 10 ou 11;
* Navegador de Internet;
* Microsoft Visiual Studio Code, link: https://code.visualstudio.com/download
* Node.js, link: https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi
* XAMPP, link: https://www.apachefriends.org/pt_br/download.html

## Como começar:

Clone o repositório:

```
https://github.com/AlexSnider/Projeto-API-e-commerce-Node.js/tree/main/Backend
```

Execute:
```
cd backend
```
em caso da aplicação não estiver setada nessa pasta,

Edite o arquivo:

`.ENV.EXAMPLE` e config/ `.config.json`

e insira os dados requeridos,

Execute o comando:
```
npm i
```
para instalar as dependências,

Execute as migrações com o comando:

```
npx sequelize-cli db:migrate
```

Execute a aplicação com:
```
npm start
```

Abra seu navegador e navegue até https://localhost:3002/api-docs.

