import React from "react";

import { Container, Card } from "react-bootstrap";

import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div style={{ height:"600px"}} className="d-flex justify-content-center align-items-center">
            <Container className="d-flex flex-wrap justify-content-center">

                <Link to="/clientes">
                    <Card className="home-card">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mx-4">
                                <i className="fa-regular fa-address-card home-card-icon pt-1" style={{ fontSize: "65px" }}></i>
                                <div className="home-card-title">Clientes</div>
                            </div>
                        </Card.Body>
                    </Card> 
                </Link>

                <Link to="/produtos">
                    <Card className="home-card">
                        <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mx-4">
                                <i className="fa-solid fa-tag home-card-icon pt-1" style={{ fontSize: "70px" }}></i>
                                <div className="home-card-title">Produtos</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Link>

                <Link to="/pedidos/consulta">
                    <Card className="home-card">
                        <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mx-3">
                                <i className="fa-solid fa-magnifying-glass home-card-icon pb-1" style={{ fontSize: "60px" }}></i>
                                <div className="home-card-title">
                                    Consultar
                                    <br></br>
                                    Pedidos
                                </div>
                            </div>
                        </Card.Body>
                    </Card> 
                </Link>

                <Link to="/pedidos/cadastro">
                    <Card className="home-card">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mx-2">
                                <i className="fa fa-shopping-cart home-card-icon" style={{ fontSize: "60px" }}></i>
                                <div className="home-card-title">
                                    Cadastrar
                                    <br></br>
                                    Pedido
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Link>

            </Container>

            <div className="footer">
                <div className="text-center pt-3">
                    <p className="footer-text">ADS1241 - Desenvolvimento de Software Web</p>
                    <p className="footer-text">Atividade Final: Desenvolvimento Full-Stack com React e Spring Boot</p>
                </div>
            </div>
            
        </div>
    );
}

export default HomePage