import React, { useEffect, useState } from "react";

import { Button, Card, CardFooter, CardHeader, Container, Form, InputGroup, ListGroup, Modal, Image } from "react-bootstrap";
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
    const [saveModal, setSaveModal] = useState(false);
    const closeSaveModal = () => setSaveModal(false);
    const showSaveModal = () => setSaveModal(true);

    const [editModal, setEditModal] = useState(false);
    const closeEditModal = () => setEditModal(false);
    const showEditModal = () => setEditModal(true);

    // PAGE
    const [clientes, setClientes] = useState([]);

    const [nomeCliente, setNomeCliente] = useState('');

    const [id, setId] = useState('');
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

    const editCliente = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const cliente = { 
            nome: nome, 
            email: email,
            telefone: _removeMaskPhone(telefone) 
        };

        try {
            const response = await fetch(`${apiUrl}/clientes/${id}`, { 
                method: 'PUT',
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
            setNomeCliente('');
            setEditModal(false);

            await findAll();
            
            setIsLoading(false);
            showSuccess('Sucesso.', 'Cliente editado com sucesso.');
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
                const message = error.message ? error.message : 'Ocorreu um erro ao editar cliente.'
                showError('Erro', message)
            }
        }
    }

    const deleteCliente = async (cliente) => {
        if (!window.confirm(`Deseja mesmo apagar o cliente ${cliente.nome} ?`)) {
            return;
        }
        
        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/clientes/${cliente.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const dataError = await response.json();
                console.log(dataError);
                throw dataError;
            }

            findAll();
            
            setIsLoading(false);
            showSuccess('Sucesso.', 'Cliente apagado com sucesso.');
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
                const message = error.message ? error.message : 'Ocorreu um erro ao apagar cliente.'
                showError('Erro', message)
            }
        }
    }

    const saveCliente = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const cliente = { 
            nome: nome, 
            email: email, 
            telefone: _removeMaskPhone(telefone)
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
            setSaveModal(false);

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

    // UTILS
    const applyMaskPhone = (event) => {
        console.log(event);
        console.log(event.target.value);
        let value = event.target.value.replace(/\D/g, '');
    
        switch (value.length) {
            case 1:
                value = value.replace(/^(\d{1})$/, '($1');
                break;
            case 2:
                value = value.replace(/^(\d{2})$/, '($1)');
                break;
            case 3:
            case 4:
            case 5:
            case 6:
                value = value.replace(/^(\d{2})(\d{1,4})$/, '($1) $2');
                break;
            case 7:
                value = value.replace(/^(\d{2})(\d{5})$/, '($1) $2-');
                break;
            case 8:
            case 9:
            case 10:
            case 11:
                value = value.replace(/^(\d{2})(\d{5})(\d{1,4})$/, '($1) $2-$3');
                break;
            default:
                break;
        }
    
        setTelefone(value);
    }

    const _removeMaskPhone = (telefone) => {
        const ddd = telefone.substring(1, 3);
        const first = telefone.substring(5, 10);
        const second = telefone.substring(11, telefone.length);
    
        return ddd + first + second;
    }

    // EFFECTS
    useEffect(() => {
        findAll();
    }, []);

    useEffect(() => {
        findByName(nomeCliente);
    }, [nomeCliente]);

    return (
        <Container>
            <LoadingComponent isLoading={isLoading}></LoadingComponent>

            <div className="border page-header my-4 py-2">
                <div className="d-flex justify-content-start align-items-center">
                    <Link to={'/'}>
                        <Image 
                            src="/back.png" 
                            height={25} 
                            className="back-icon mx-4"
                        ></Image>
                    </Link>
                    <h4 className="page-title">Clientes</h4>
                </div>
            </div>

            <div className="d-flex border p-4 py-4 custom-content">

                <div className="col me-3">
                    <InputGroup className="">
                        <Form.Control
                            type="text"
                            className="text-center cliente-input" 
                            placeholder="Consulte o cliente pelo nome"
                            value={nomeCliente}
                            onChange={(e) => setNomeCliente(e.target.value)}
                        />
                    </InputGroup>
                </div>

                <div>
                    <Button className="default-button" onClick={() => {
                        setNome('');
                        setEmail('');
                        setTelefone('');
                        showSaveModal();
                    }}>
                        Novo cliente
                    </Button>
                </div>
            </div>

            <div className="d-flex flex-wrap justify-content-center">
                {clientes.length > 0 
                ? 
                (
                    clientes.map((cliente) => {
                        return (
                            <Card style={{ width: '24rem' }} key={cliente.id} className="pedido-card m-4">
                                <CardHeader>
                                    <Card.Title className="pt-2">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="cliente-card-title">
                                                {cliente.nome}
                                            </div>
                                            <div> 
                                                <Button 
                                                    key={"button-2"}
                                                    className="default-button" 
                                                    style={{ borderRadius: "50px", fontSize: "18    px" }} 
                                                    onClick={() => {
                                                         setId(cliente.id); 
                                                         setNome(cliente.nome);
                                                         setEmail(cliente.email);
                                                         setTelefone(maskPhone(cliente.telefone));
                                                         showEditModal();
                                                    }}
                                                >
                                                    <i className="fa-solid fa-pencil"></i> 
                                                </Button>
                                                
                                                
                                                <Button 
                                                    className="cancel-button ms-2" 
                                                    style={{ borderRadius: "50px" }}
                                                     onClick={() => deleteCliente(cliente)}
                                                >
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </Button>
                                            </div>
                                        </div>
                                    </Card.Title>
                                </CardHeader>
                                <ListGroup className="list-group-flush">
                                        <ListGroup.Item className="table-content-info">
                                            ID: {cliente.id}
                                        </ListGroup.Item>
                                        <ListGroup.Item className="table-content-info">
                                            E-mail: {cliente.email}
                                        </ListGroup.Item>
                                        <ListGroup.Item className="table-content-info">
                                            Telefone: {maskPhone(cliente.telefone)}
                                        </ListGroup.Item>
                                            <ListGroup.Item className="table-content-info">
                                            Data de Cadastro: {cliente.dataCadastro}
                                        </ListGroup.Item>
                                </ListGroup>
                                <CardFooter>
                                    <div className="d-flex justify-content-end">
                                        <Link to={`/pedidos/consulta/${cliente.id}`} className="cliente-card-link">
                                            Ver pedidos
                                        </Link>
                                    </div>
                                </CardFooter>
                            </Card>
                        );
                    })
                ) 
                : 
                (
                    <div className="text-center pt-4 blank-message">
                        <p>Não foram encontrados clientes.</p>
                    </div>
                )
                }
            </div>

            <Modal show={saveModal} onHide={closeSaveModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar cliente</Modal.Title>
                </Modal.Header>
                
                <Modal.Body className="p-4">
                    <Form onSubmit={saveCliente}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control 
                                type="text" 
                                className="text-center" 
                                required
                                placeholder="nome"
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
                                placeholder="email@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Telefone</Form.Label>
                            <Form.Control 
                                type="text"
                                className="text-center" 
                                required
                                placeholder="(99) 99999-9999"
                                maxLength={15}
                                value={telefone}
                                onChange={applyMaskPhone}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end py-3">
                            <Button className="confirm-button mx-3" type="submit">
                                Cadastrar
                            </Button>
                            <Button className="cancel-button" onClick={closeSaveModal}>
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={editModal} onHide={closeEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar cliente</Modal.Title>
                </Modal.Header>
                
                <Modal.Body className="p-4">
                    <Form onSubmit={editCliente}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control 
                                type="text" 
                                className="text-center" 
                                required
                                placeholder="nome"
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
                                placeholder="email@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Telefone</Form.Label>
                            <Form.Control 
                                type="text"
                                className="text-center" 
                                required
                                placeholder="(99) 99999-9999"
                                value={telefone}
                                maxLength={15}
                                onChange={applyMaskPhone}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end py-3">
                            <Button className="confirm-button mx-3" type="submit">
                                Salvar
                            </Button>
                            <Button className="cancel-button" onClick={closeEditModal}>
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            
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