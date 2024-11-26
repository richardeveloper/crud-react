import React from 'react';

import { Outlet } from 'react-router-dom';

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

const LayoutPage = () => {
    return (
        <div>
            <Navbar bg="dark" data-bs-theme="dark" className="px-3">

                <Navbar.Brand href="/" className="nav-title">
                    <div>
                        CrudGames
                    </div>
                </Navbar.Brand>

                <Nav className="ms-auto">

                    <Nav.Link href="/clientes" className="nav-option px-4">     
                        <span>Clientes</span>
                    </Nav.Link>

                    <Nav.Link href="/produtos" className="nav-option px-4">
                        <span>Produtos</span>
                    </Nav.Link>

                    <NavDropdown align={"end"} title="Pedidos" className="nav-option">

                        <NavDropdown.Item href="/pedidos/consulta" className="nav-option">
                            <span>Consultar Pedidos</span>
                        </NavDropdown.Item>

                        <NavDropdown.Item href="/pedidos/cadastro" className="nav-option">
                            <span>Cadastrar pedido</span>
                        </NavDropdown.Item>
                        
                    </NavDropdown>

                </Nav>

            </Navbar>

            <Outlet></Outlet>
        </div>
    );
}

export default LayoutPage;