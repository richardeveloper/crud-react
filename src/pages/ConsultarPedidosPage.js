import React, { useEffect, useState } from "react";

import { Card, CardFooter, CardHeader, Col, Container, Dropdown, Form, InputGroup, ListGroup, Table } from "react-bootstrap";
import { Link, useParams } from 'react-router-dom';

import { masksHelper } from "../helpers/masksHelper";
import { useToast } from "../hooks/useToast";

import LoadingComponent from "../components/LoadingComponent";
import ToastComponent from "../components/ToastComponent";

const apiUrl = process.env.REACT_APP_API_URL;

const ConsultarPedidosPage = () => {

    // PARAMS
    const { clienteId } = useParams();

    // HOOKS
    const { maskMoney, maskPhone} = masksHelper();
    const { showToast, closeToast, title, message, background, showError, showWarning } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    // PAGE
    const [pedidos, setPedidos] = useState([]);
    const [clientes, setClientes] = useState([]);
    
    const [nomeCliente, setNomeCliente] = useState([]);

    // REQUESTS
    const findAllClientes = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/clientes`);
            
            if (!response.ok) {
                const dataError = await response.json();
                console.log(dataError);
                throw dataError;
            }
            
            const data = await response.json();
            console.log(data);

            setClientes(data);

            setIsLoading(false);
        }
        catch (error) {
            setIsLoading(false);
            closeToast();

            if (error.invalidFields) {
                error.invalidFields.map((invalidField) => {
                    return showWarning('Aviso', invalidField.message);
                });
            }
            else {
                const message = error.message ? error.message : 'Ocorreu um erro ao buscar os produtos.'
                showError('Erro', message)
            }
        }
    }

    const findByCliente = async (clienteId) => {
        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/pedidos/cliente/${clienteId}`);

            if (!response.ok) {
                const dataError = await response.json();
                console.log(dataError);
                throw dataError;
            }
            
            const data = await response.json();
            console.log(data);

            setPedidos(data);

            setIsLoading(false);

            if (data.length === 0) {
                showWarning('Aviso', 'O cliente ainda não possui pedidos cadastrados.')
                return;
            }
        }
        catch (error) {
            setIsLoading(false);
            closeToast();

            if (error.invalidFields) {
                error.invalidFields.map((invalidField) => {
                    return showWarning('Aviso', invalidField.message);
                });
            }
            else {
                const message = error.message ? error.message : 'Ocorreu um erro ao buscar o cliente.'
                showError('Erro', message)
            }
        }
    }

    // EFFECTS
    useEffect(() => {
        findAllClientes();
    }, []);

    useEffect(() => {
        if (clienteId) {
            const cliente = clientes.find((e) => e.id === parseInt(clienteId));
            if (cliente) {
                setNomeCliente(cliente.nome);
                findByCliente(clienteId);
            }
        }
    }, [clientes, clienteId]);

    return (
        <Container>
            <LoadingComponent isLoading={isLoading}></LoadingComponent>
            
            <div className="py-4">
                <div className="d-flex justify-content-center align-items-center">
                    <i className="fa fa-bar-chart me-2 pb-1" style={{ fontSize: "30px" }} aria-hidden="true"></i>   
                    <h2>Consultar Pedidos</h2>
                </div>
            </div>

            <Container className="d-flex flex-wrap align-items-center border p-4 py-4 custom-content">

                <Col className="px-2">
                    <Dropdown className="d-inline">
                        <Dropdown.Toggle size="md" className="custom-dropdown-toggle default-button">
                            Selecione o cliente
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="custom-dropdown-toggle">
                            {clientes.map((cliente) => {
                                return (
                                    <Dropdown.Item 
                                        onClick={() => {
                                            setNomeCliente(cliente.nome);
                                            findByCliente(cliente.id);
                                        }} 
                                        key={cliente.id}
                                        eventKey={cliente.id} 
                                        className="custom-dropdown-item"
                                    >
                                    {cliente.nome}</Dropdown.Item>        
                                );
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>

                <Col className="px-2">
                    <InputGroup>
                        <Form.Control
                            type="text"
                            className="text-center" 
                            placeholder="Nenhum cliente selecionado"
                            readOnly
                            value={nomeCliente}
                        />
                    </InputGroup>
                </Col>
            </Container>

            { pedidos.length > 0 
            ? 
            (
                <div className="d-flex flex-wrap justify-content-center pt-4">
                    {
                        pedidos.map((pedido) => {
                            return (
                                <Card style={{ width: '32rem' }} key={pedido.id} className="pedido-card m-4">
                                    <CardHeader>
                                        <Card.Title className="pt-2">
                                            Pedido {pedido.id}
                                        </Card.Title>
                                    </CardHeader>
                                    <div>
                                        <ListGroup className="list-group-flush">
                                            <ListGroup.Item>Nome:  
                                                <a href="/clientes"> {pedido.cliente.nome}</a>
                                            </ListGroup.Item>
                                            <ListGroup.Item>E-mail: {pedido.cliente.email}</ListGroup.Item>
                                            <ListGroup.Item>Telefone: {maskPhone(pedido.cliente.telefone)}</ListGroup.Item>
                                            <ListGroup.Item>Data do Pedido: {pedido.dataPedido}</ListGroup.Item>
                                            <ListGroup.Item></ListGroup.Item>
                                        </ListGroup>
                                    </div>
                                    <Card.Body>
                                        <Table responsive striped bordered hover size="sm">
                                            <thead className='text-center'>
                                                <tr>
                                                    <th>Nome</th>
                                                    <th>Preço</th>
                                                </tr>
                                            </thead>
                                            <tbody className='text-center'>
                                                {pedido.produtos.map((produto) => {
                                                        return (
                                                            <tr key={produto.id}>
                                                                <td>
                                                                    <Link to={'/produtos'}>{produto.nome}</Link>
                                                                </td>
                                                                <td>{maskMoney(produto.preco)}</td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                    <CardFooter>
                                        <div className="d-flex justify-content-between">
                                            <p><strong>Valor Total</strong></p>
                                            <p><strong>{maskMoney(pedido.valorTotal)}</strong></p>
                                        </div>
                                    </CardFooter>
                                </Card>
                            );
                        })
                    }
                </div>
            )
            :
            (
                <div className="text-center pt-5">
                    <p>Não foram encontrados pedidos.</p>
                </div>
            )
            }

            <ToastComponent
                show={showToast}
                title={title}
                message={message}
                background={background}
                onClose={closeToast}
                delay={7000}
                autohide={true}
            />

        </Container>
    );
}

export default ConsultarPedidosPage;