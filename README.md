# Projeto API para mini e-commerce

O projeto foi desenvolvido para aplicação de conhecimentos adquiridos durante a faculdade e estudos pessoais. <br/>

### Após o commit versão 0.7.1, o projeto está sendo atualizado com novas features e tecnologias seguindo as orientações do mentor [Vitor Hugo](https://www.linkedin.com/in/vitorhcs/).<br/>

### Adições:

* Keycloak
* Express Rate Limit
* Argon2
* Headers (location)
* Logs 5wLogs
* Commits ES Linter (feat, chore, fix, etc...)
* Paginação
* Versionamento de API
* Jmeter (aplicação para teste de carga)
* OpenTelemetry e Jaeger (em fase de implementação)
* Docker (external - Keycloak e OpenTelemetry)

### Essa aplicação é uma das partes do projeto mini e-commerce. Em específico, o back-end. <br/>

A aplicação pode `registrar/manejar usuários`, `ordens` e seus `itens`, `produtos` e `categorias`.

![node-js-736399_1920](https://github.com/AlexSnider/Projeto-API-e-commerce-Node.js/assets/103783575/18da5724-9985-4320-ae21-800a2ebfb092)

<p align="center">Node.js® is an open-source, cross-platform JavaScript runtime environment.<p/>


# Pré-requisitos

* Windows 10 ou 11;
* Navegador de Internet;
* Microsoft Visiual Studio Code, link: https://code.visualstudio.com/download
* Node.js, link: https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi
* XAMPP, link: https://www.apachefriends.org/pt_br/download.html

# Tecnologias empregadas

* Sequelize
* Json Web Tokens
* Express
* Nodemailer
* Swagger - documentação
* UUID - gerador de ID's únicos aos usuários

# Como começar

Clone o repositório:

```
https://github.com/AlexSnider/Projeto-API-e-commerce-Node.js/tree/main
```

Edite o arquivo:

`.env.example` e config/ `.config.json`

e insira os dados requeridos,

Execute o comando:
```
npm install
```
para instalar as dependências necessárias para rodar a aplicação,

Abra e de start em `Apache` e `MySQL` no XAMPP e crie uma base de dados para a aplicação.

Execute as migrações com o comando:

```
npx sequelize-cli db:migrate
```

Execute a aplicação com:
```
npm start
```

Abra seu navegador e navegue até http://localhost:3002/api-docs.

# Uso

A API fornece endpoins para o manejo de uma mini loja e-commerce com diversos produtos.

Após o start da aplicação, o link fornecido com o caminho API DOCS, contém todos esses endpoints e suas funcionalidades descritas.

Você pode interagir com a API através da documentação ou usar programas como Postman ou Insomnia.

# Funcionalidades Extras

A API apresenta a capacidade de envio de e-mails a cada ordem registrada diretamente para o usuário que efetuou a ordem.

Imagem de exemplo:

![image](https://github.com/AlexSnider/Projeto-API-e-commerce-Node.js/assets/103783575/2100ee2a-161b-4053-8882-283fc083eaf9)

Se o usuário decidir trocar a sua senha, um e-mail é enviado para que seja feita a troca com uma chave única de acesso.

Exemplo:

![image](https://github.com/AlexSnider/Projeto-API-e-commerce-Node.js/assets/103783575/51a5d6f1-ad94-4df3-962d-33b010d62be7)

# Durante o desenvolvimento

Me propus a construir uma API com as tecnologias listadas e o resultado está sendo esse.
A estrutura é simples, são pequenos gerenciamentos de uma mini loja, mas a ideia principal foi entregar algo de uso prático e estruturado.
Houveram complicações em como manejar ordens e itens de maneira simultânea, mas consegui lidar com o desafio.

Sigo em constante aprendizado e buscando novas tecnologias como forma de amadurecer meus conhecimentos.

# Licença

Esse projeto está sob licença [MIT](https://github.com/AlexSnider/Projeto-API-e-commerce-Node.js/blob/main/LICENCE).
