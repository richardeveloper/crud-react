import React, { useEffect, useState } from "react";
import { Button, Card, CardFooter, CardHeader, Col, Container, Dropdown, Form, Image, InputGroup, ListGroup, Table } from "react-bootstrap";
import { Link, useParams } from 'react-router-dom';
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingComponent from "../components/LoadingComponent";
import { masksHelper } from "../helpers/masksHelper";
import { apiRequest } from "../hooks/apiRequest";

const apiUrl = process.env.REACT_APP_API_URL;

const ConsultarPedidosPage = () => {

    // PARAMS
    const { clienteId } = useParams();

    // HOOKS
    const { applyMaskMoney, applyMaskPhone} = masksHelper();
    const [isLoading, setIsLoading] = useState(true);

    // PAGE
    const [pedidos, setPedidos] = useState([]);
    const [clientes, setClientes] = useState([]);
    
    const [nomeCliente, setNomeCliente] = useState([]);

    // REQUESTS
    const findAllClientes = async () => {
        setIsLoading(true);

        let data;

        try {
            data = await apiRequest(`${apiUrl}/clientes`);
        }
        catch (error) {
            setIsLoading(false);
            return;
        }

        setClientes(data);

        setIsLoading(false);
    }

    const findByCliente = async (clienteId) => {
        setIsLoading(true);

        let data;

        try {
            data = await apiRequest(`${apiUrl}/pedidos/cliente/${clienteId}`);
            console.log(data);
        }
        catch (error) {
            setIsLoading(false);
            return;
        }

        setPedidos(data);

        setIsLoading(false);

        if (data.length === 0) {
            toast.warning('Não foram encontrados pedidos cadastrados para o cliente.')
        }
    }

    const deletePedido = async (pedido) => {
        if (!window.confirm(`Deseja mesmo apagar o pedido ${pedido.id} ?`)) {
            return;
        }
        
        setIsLoading(true);
            await fetch(`${apiUrl}/pedidos/${pedido.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        try {

        }
        catch (error) {
            setIsLoading(false);
            return;
        }

        await findByCliente(pedido.cliente.id);
            
        setIsLoading(false);

        toast.success('Pedido apagado com sucesso.');
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

            <ToastContainer position="bottom-right" autoClose={3000} transition={Slide} style={{ fontSize: "18px"}} closeOnClick/>

            <LoadingComponent isLoading={isLoading}/>
            
            <div className="border page-header  my-4 py-2">
                <div className="d-flex justify-content-start align-items-center">
                    <Link to={'/'}>
                        <Image 
                            src="/back.png" 
                            height={25}
                            className="back-icon mx-4"
                        ></Image>
                    </Link>
                    <h4 className="page-title">Consultar pedido</h4>
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
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="pedido-title">
                                                Pedido {pedido.id}
                                            </div>
                                            <div> 
                                                <Button 
                                                    className="cancel-button ms-2" 
                                                    style={{ borderRadius: "50px" }}
                                                     onClick={() => deletePedido(pedido)}
                                                >
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </Button>
                                            </div>
                                        </div>

                                        </Card.Title>
                                    </CardHeader>
                                    <div>
                                        <ListGroup className="list-group-flush">
                                            <ListGroup.Item className="table-content-info">
                                                ID: {pedido.cliente.id}
                                            </ListGroup.Item>
                                            <ListGroup.Item className="table-content-info">
                                                Nome:  <a href="/clientes"> {pedido.cliente.nome}</a>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="table-content-info">
                                                E-mail: {pedido.cliente.email}
                                            </ListGroup.Item>
                                            <ListGroup.Item className="table-content-info">
                                                Telefone: {applyMaskPhone(pedido.cliente.telefone)}
                                                </ListGroup.Item>
                                                <ListGroup.Item className="table-content-info">
                                                Data do Pedido: {pedido.dataPedido}
                                            </ListGroup.Item>
                                            <ListGroup.Item></ListGroup.Item>
                                        </ListGroup>
                                    </div>
                                    <Card.Body>
                                        <Table responsive striped bordered hover size="sm">
                                            <thead className='text-center'>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Nome</th>
                                                    <th>Preço</th>
                                                </tr>
                                            </thead>
                                            <tbody className='text-center'>
                                                {pedido.produtos.map((produto) => {
                                                        return (
                                                            <tr key={produto.id}>
                                                                <td className="align-middle">{produto.id}</td>
                                                                <td className="align-middle">
                                                                    <Link to={'/produtos'}>{produto.nome}</Link>
                                                                </td>
                                                                <td className="align-middle">{applyMaskMoney(produto.preco)}</td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                    <CardFooter style={{ height: "50px" }}>
                                        <div className="d-flex justify-content-between">
                                            <p className="pedido-card-price">
                                                <strong>Valor Total</strong>
                                            </p>
                                            <p className="pedido-card-price">
                                                <strong>{applyMaskMoney(pedido.valorTotal)}</strong>
                                            </p>
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
                <div className="text-center pt-5 blank-message">
                    <p>Não foram encontrados pedidos.</p>
                </div>
            )
            }

        </Container>
    );
}

export default ConsultarPedidosPage;