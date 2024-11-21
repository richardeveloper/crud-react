# ADS1241 - Atividade Final: Desenvolvimento Full-Stack com React e Spring Boot

<div align="center">

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

</div>

## Instruções

<p align="justify">
Criar um sistema de frontend usando React para consumir os serviços disponibilizados pelo backend implementado com Spring Boot na Atividade 09.
</p>

## Tecnologias a serem utilizadas para o frontend:

> - React
> - React Router (para navegação entre as páginas)
> - Material-UI ou Bootstrap (opcional, para estilização)
> - Estado gerenciado com React Hooks (useState e useEffect)

## Funcionalidades obrigatórias:

### Página inicial:

> - Exibir links de navegação para as páginas de “Clientes”, “Produtos” e “Pedidos”.

### Módulo de Clientes:

> - Listar todos os clientes cadastrados.
> - Buscar clientes pelo nome.
> - Adicionar novos clientes (formulário com validação).

### Módulo de Produtos:

> - Listar todos os produtos cadastrados.
> - Buscar produtos pelo nome.
> - Adicionar novos produtos (formulário com validação).

### Módulo de Pedidos:
> - Listar todos os pedidos.
> - Buscar pedidos por cliente ou produto.
> - Adicionar novos pedidos, selecionando cliente e produtos em menus suspensos.

### Validações de frontend:

> - Campos obrigatórios não podem ser enviados vazios.
> - Preço do produto deve ser maior que zero.

### Chamadas à API:

> - Integrar o frontend com o backend.

> [!TIP]
> 
> ### Rodar aplicação
>
> **Requisitos:**
> - Java 17 ou superior
> - PostgreSQL
>
> **Variáveis para conexão com banco de dados:**
>
> ```
> export DB_URL="jdbc:postgresql://localhost:5432/database"
> export DB_USERNAME="postgres"
> export DB_PASSWORD="postgres"
> ```
>
> **Documentação da API:**
> > <a href="http://localhost:8080/swagger-ui" style="text-decoration: none;">Swagger UI</a>
