import React, { useEffect, useState } from "react";

import { Button, Card, CardFooter, CardHeader, Container, Form, InputGroup, ListGroup, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

import { masksHelper } from "../helpers/masksHelper";
import { useToast } from "../hooks/useToast";

import LoadingComponent from "../components/LoadingComponent";
import ToastComponent from "../components/ToastComponent";

const apiUrl = process.env.REACT_APP_API_URL;

const ClientePage = () => {

    // HOOKS
    const { maskPhone } = masksHelper();
    const { showToast, closeToast, title, message, background, showSuccess, showError, showWarning } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    // MODAL
    const [modal, setModal] = useState(false);
    const closeModal = () => setModal(false);
    const showModal = () => setModal(true);

    // PAGE
    const [clientes, setClientes] = useState([]);

    const [nomeCliente, setNomeCliente] = useState('');

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    
    // REQUESTS
    const findAll = async () => {
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
                const message = error.message ? error.message : 'Ocorreu um erro ao buscar clientes.'
                showError('Erro', message)
            }
        }
    }

    const findByName = async (nomeCliente) => {
        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/clientes/nome?nome=${nomeCliente}`);

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
                const message = error.message ? error.message : 'Ocorreu um erro ao buscar cliente por nome.'
                showError('Erro', message)
            }
        }
    }

    const save = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const cliente = { 
            nome: nome, 
            email: email, 
            telefone: telefone 
        };

        try {
            const response = await fetch(`${apiUrl}/clientes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cliente)
            });

            if (!response.ok) {
                const dataError = await response.json();
                console.log(dataError);
                throw dataError;
            }

            const data = await response.json();
            console.log(data);

            setNome('');
            setEmail('');
            setTelefone('');
            setModal(false);

            findAll();

            closeToast();

            setIsLoading(false);
            showSuccess('Sucesso.', 'Cliente cadastrado com sucesso.');
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
                const message = error.message ? error.message : 'Ocorreu um erro ao cadastrar cliente.'
                showError('Erro', message)
            }
        }
    }

    // EFFECTS
    useEffect(() => {
        findAll();
    }, []);

    useEffect(() => {
        if (nomeCliente) {
            findByName(nomeCliente);
        }
    }, [nomeCliente]);

    return (
        <Container>
            <LoadingComponent isLoading={isLoading}></LoadingComponent>

            <div className="py-4">
                <div className="d-flex justify-content-center align-items-center">
                    <i className="fa fa-id-card-o me-3 pb-2" style={{ fontSize: "30px" }} aria-hidden="true"></i>   
                    <h2>Clientes</h2>
                </div>
            </div>

            <div className="d-flex border p-4 py-4 custom-content">

                <div className="col me-3">
                    <InputGroup>
                        <Form.Control
                            type="text"
                            className="text-center" 
                            placeholder="Consulte o cliente pelo nome"
                            value={nomeCliente}
                            onChange={(e) => setNomeCliente(e.target.value)}
                        />
                    </InputGroup>
                </div>

                <div>
                    <Button className="default-button" onClick={showModal}>
                        Novo cliente
                    </Button>

                    <Modal show={modal} onHide={closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Cadastrar Cliente</Modal.Title>
                        </Modal.Header>
                        
                        <Modal.Body>
                            <Form onSubmit={save}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        className="text-center" 
                                        required
                                        placeholder="Digite o nome do cliente"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        className="text-center" 
                                        required
                                        placeholder="Digite o e-mail do cliente"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Telefone</Form.Label>
                                    <Form.Control 
                                        type="number"
                                        className="text-center" 
                                        required
                                        placeholder="Digite o telefone do cliente"
                                        value={telefone}
                                        onChange={(e) => setTelefone(e.target.value)}
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-end py-3">
                                    <Button className="confirm-button mx-3" type="submit">
                                        Cadastrar
                                    </Button>
                                    <Button className="cancel-button" onClick={closeModal}>
                                        Cancelar
                                    </Button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>

            <div className="d-flex flex-wrap justify-content-center pt-4">
                {clientes.length > 0 
                ? 
                (
                    clientes.map((cliente) => {
                        return (
                            <Card style={{ width: '24rem' }} key={cliente.id} className="pedido-card m-4">
                                <CardHeader>
                                    <Card.Title className="pt-2">
                                        {cliente.nome}
                                    </Card.Title>
                                </CardHeader>
                                <ListGroup className="list-group-flush">
                                        <ListGroup.Item>E-mail: {cliente.email}</ListGroup.Item>
                                        <ListGroup.Item>Telefone: {maskPhone(cliente.telefone)}</ListGroup.Item>
                                        <ListGroup.Item>Data de Cadastro: {cliente.dataCadastro}</ListGroup.Item>
                                </ListGroup>
                                <CardFooter>
                                    <div className="d-flex justify-content-end">
                                        <Link to={`/pedidos/consulta/${cliente.id}`}>Ver pedidos</Link>
                                    </div>
                                </CardFooter>
                            </Card>
                        );
                    })
                ) 
                : 
                (
                    <div className="text-center pt-4">
                        <p>Não foram encontrados clientes.</p>
                    </div>
                )
                }
            </div>
            
            <ToastComponent
                show={showToast}
                title={title}
                message={message}
                background={background}
                onClose={closeToast}
                delay={5000}
                autohide={true}
            />

        </Container>
    );
}

export default ClientePage