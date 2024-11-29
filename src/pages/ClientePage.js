import React, { useEffect, useState } from "react";
import { Button, Card, CardFooter, CardHeader, Container, Form, Image, InputGroup, ListGroup, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingComponent from "../components/LoadingComponent";
import { masksHelper } from "../helpers/masksHelper";
import { apiRequest } from "../hooks/apiRequest";

const apiUrl = process.env.REACT_APP_API_URL;

const ClientePage = () => {

    // HOOKS
    const { applyMaskPhone, applyEventMaskPhone } = masksHelper();
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

        let data;

        try {
            data = await apiRequest(`${apiUrl}/clientes`, {});

        }
        catch (error) {
            setIsLoading(false);
            return;
        }

        setClientes(data);

        setIsLoading(false); 
    }

    const findByName = async (nomeCliente) => {
        setIsLoading(true);

        let data;

        try {
            data = await apiRequest(`${apiUrl}/clientes/nome?nome=${nomeCliente}`, {});
            console.log(data); 
        }
        catch (error) {
            setIsLoading(false);
            return;
        }

        setClientes(data);

        setIsLoading(false);
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
            await apiRequest(`${apiUrl}/clientes/${id}`, { 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cliente)
            });
        }
        catch (error) {
            setIsLoading(false);
            return;
        }

        _clearForm();
        setNomeCliente('');
        setEditModal(false);

        await findAll();
        
        setIsLoading(false);

        toast.success('Cliente editado com sucesso.');
    }

    const deleteCliente = async (cliente) => {
        if (!window.confirm(`Deseja mesmo apagar o cliente ${cliente.nome} ?`)) {
            return;
        }
        
        setIsLoading(true);

        try {
            await apiRequest(`${apiUrl}/clientes/${cliente.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        catch (error) {
            setIsLoading(false);
            return;
        }

        findAll();
            
        setIsLoading(false);
        toast.success('Cliente apagado com sucesso.');
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
            await fetch(`${apiUrl}/clientes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cliente)
            });
        }
        catch (error) {
            setIsLoading(false);
            return;
        }

        _clearForm();
        setSaveModal(false);

        findAll();

        setIsLoading(false);

        toast.success('Cliente cadastrado com sucesso.');
    }

    // UTILS
    const _clearForm = () => {
        setNome('');
        setEmail('');
        setTelefone('');
    };

    const applyMask = (event) => {
        let value = applyEventMaskPhone(event);
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

            <ToastContainer position="bottom-right" autoClose={3000} transition={Slide} style={{ fontSize: "18px"}} closeOnClick/>

            <LoadingComponent isLoading={isLoading}/>

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
                        _clearForm();
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
                                                         setTelefone(applyMaskPhone(cliente.telefone));
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
                                            Telefone: {applyMaskPhone(cliente.telefone)}
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
                                onChange={applyMask}
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
                                onChange={applyMask}
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

        </Container>
    );
}

export default ClientePage