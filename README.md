# ADS1241 - Atividade Final: Desenvolvimento Full-Stack com React e Spring Boot

<div align="center">

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

</div>

## Sumário

- [Instruções](#instruções)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
    - [Página Inicial](#página-inicial)
    - [Módulo de Clientes](#módulo-de-clientes)
    - [Módulo de Produtos](#módulo-de-produtos)
    - [Módulo de Pedidos](#módulo-de-pedidos)
- [Validações](#validações)
- [Integração](#integração)

## Instruções

<p align="justify">
Criar um sistema de frontend usando React para consumir os serviços disponibilizados pelo backend implementado com Spring Boot na <a href="https://github.com/richardeveloper/crud-spring-boot" style="text-decoration: none;">Atividade 09</a>.
</p>

## Tecnologias

- React
- React Router (para navegação entre as páginas)
- Material-UI ou Bootstrap (opcional, para estilização)
- Estado gerenciado com React Hooks (useState e useEffect)

## Funcionalidades

### Página inicial

- Exibir links de navegação para as páginas de “Clientes”, “Produtos” e “Pedidos”.

### Módulo de Clientes

- Listar todos os clientes cadastrados.
- Buscar clientes pelo nome.
- Adicionar novos clientes (formulário com validação).

### Módulo de Produtos

- Listar todos os produtos cadastrados.
- Buscar produtos pelo nome.
- Adicionar novos produtos (formulário com validação).

### Módulo de Pedidos
- Listar todos os pedidos.
- Buscar pedidos por cliente ou produto.
- Adicionar novos pedidos, selecionando cliente e produtos em menus suspensos.

### Validações

- Campos obrigatórios não podem ser enviados vazios.
- Preço do produto deve ser maior que zero.

### Integração

- Integrar o frontend com o backend.
