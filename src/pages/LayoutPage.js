import React from 'react';

import { Outlet } from 'react-router-dom';

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

const LayoutPage = () => {
    return (
        <div>
            <Navbar bg="dark" data-bs-theme="dark" className="px-3">

                <Navbar.Brand href="/" className="nav-title">
                    CRUD Full Stack
                </Navbar.Brand>

                <Nav className="ms-auto">

                    <Nav.Link href="/clientes" className="nav-option">     
                        <span>Clientes</span>
                    </Nav.Link>

                    <Nav.Link href="/produtos" className="nav-option">
                        <span>Produtos</span>
                    </Nav.Link>

                    <NavDropdown align={"end"} title="Pedidos" id="basic-nav-dropdown" className="nav-option">

                        <NavDropdown.Item href="/pedidos/consulta" className="nav-text">
                            <span>Consultar Pedidos</span>
                        </NavDropdown.Item>

                        <NavDropdown.Item href="/pedidos/cadastro" className="nav-text">
                            <span>Cadastrar Pedido</span>
                        </NavDropdown.Item>
                        
                    </NavDropdown>

                </Nav>

            </Navbar>

            <Outlet></Outlet>
        </div>
    );
}

export default LayoutPage;