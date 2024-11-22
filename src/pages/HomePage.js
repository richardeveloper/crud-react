import React from "react";

import { Container, Card } from "react-bootstrap";

import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div style={{ height:"600px"}} className="d-flex justify-content-center align-items-center">
            <Container className="d-flex flex-wrap justify-content-center">

                <Link to="/clientes">
                    <Card className="card-option">
                        <Card.Body>
                            <Container className="d-flex align-items-center d-flex justify-content-around">
                                <i className="fa fa-id-card-o card-icon" aria-hidden="true"></i>
                                <h5 className="card-option-title">Clientes</h5>
                            </Container>
                        </Card.Body>
                    </Card>
                </Link>

                <Link to="/produtos">
                    <Card className="card-option">
                        <Card.Body>
                            <Container className="d-flex align-items-center d-flex justify-content-around">
                                <i className="fa fa-tags card-icon" aria-hidden="true"></i>
                                <h5 className="card-option-title">Produtos</h5>
                            </Container>
                        </Card.Body>
                    </Card>
                </Link>

                <Link to="/pedidos/consulta">
                    <Card className="card-option">
                        <Card.Body>
                            <Container className="d-flex align-items-center d-flex justify-content-around">
                                <i className="fa fa-search card-icon" aria-hidden="true"></i>
                                <h5 className="card-option-title">Consultar Pedidos</h5>
                            </Container>
                        </Card.Body>
                    </Card> 
                </Link>

                <Link to="/pedidos/cadastro">
                    <Card className="card-option">
                        <Card.Body>
                            <Container className="d-flex align-items-center d-flex justify-content-around">
                            <i className="fa fa-shopping-cart card-icon" aria-hidden="true"></i>
                                <h5 className="card-option-title">Cadastrar Pedido</h5>
                            </Container>
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