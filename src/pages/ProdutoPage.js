import React, { useEffect, useState } from "react";

import { Button, Card, Container, Form, InputGroup, Modal, Image, CardHeader } from "react-bootstrap";

import { masksHelper } from "../helpers/masksHelper";
import { useToast } from "../hooks/useToast";

import ToastComponent from "../components/ToastComponent";
import LoadingComponent from "../components/LoadingComponent";

import { Link } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;
const fallBackImage = process.env.REACT_APP_URL_IMAGE_NOT_FOUND;

const ProdutoPage = () => {

    //HOOKS
    const { maskMoney } = masksHelper();
    const { showToast, closeToast, title, message, background, showSuccess, showError, showWarning } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    //MODAL
    const [saveModal, setSaveModal] = useState(false);
    const closeSaveModal = () => setSaveModal(false);
    const showSaveModal = () => setSaveModal(true);

    const [editModal, setEditModal] = useState(false);
    const closeEditModal = () => setEditModal(false);
    const showEditModal = () => setEditModal(true);

    // PAGE
    const [produtos, setProdutos] = useState([]);

    const [nomeProduto, setNomeProduto] = useState('');

    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [urlImagem, setUrlImagem] = useState('');
    
    // REQUESTS
    const findAll = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/produtos`);

            if (!response.ok) {
                const dataError = await response.json();
                console.log(dataError);
                throw dataError;
            }

            const data = await response.json();
            console.log(data);

            setProdutos(data);

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
                const message = error.message ? error.message : 'Ocorreu um erro ao buscar produtos.'
                showError('Erro', message)
            }
        }
    }

    const findByName = async (nomeProduto) => {
        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/produtos/nome?nome=${nomeProduto}`);

            if (!response.ok) {
                const dataError = await response.json();
                console.log(dataError);
                throw dataError;
            }

            const data = await response.json();
            console.log(data);

            setProdutos(data);

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
                const message = error.message ? error.message : 'Ocorreu um erro ao buscar produto por nome.'
                showError('Erro', message)
            }
        }
    }

    const editProduto = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const produto = { 
            nome: nome, 
            preco: preco,
            urlImagem: urlImagem 
        };

        try {
            const response = await fetch(`${apiUrl}/produtos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });

            if (!response.ok) {
                const dataError = await response.json();
                console.log(dataError);
                throw dataError;
            }

            const data = await response.json();
            console.log(data);

            _clearForm();
            setNomeProduto('');
            setEditModal(false);

            await findAll();
            
            setIsLoading(false);
            showSuccess('Sucesso.', 'Produto editado com sucesso.');
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
                const message = error.message ? error.message : 'Ocorreu um erro ao editar produto.'
                showError('Erro', message)
            }
        }
    }

    const deleteProduto = async (produto) => {
        if (!window.confirm(`Deseja mesmo apagar o produto ${produto.nome} ?`)) {
            return;
        }
        
        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/produtos/${produto.id}`, {
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
            showSuccess('Sucesso.', 'Produto apagado com sucesso.');
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
                const message = error.message ? error.message : 'Ocorreu um erro ao apagar produto.'
                showError('Erro', message)
            }
        }
    }

    const saveProduto = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const produto = { 
            nome: nome, 
            preco: preco,
            urlImagem: urlImagem 
        };

        try {
            const response = await fetch(`${apiUrl}/produtos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });

            if (!response.ok) {
                const dataError = await response.json();
                console.log(dataError);
                throw dataError;
            }

            const data = await response.json();
            console.log(data);

            _clearForm();
            setSaveModal(false);

            findAll();
            
            setIsLoading(false);
            showSuccess('Sucesso.', 'Produto cadastrado com sucesso.');
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
                const message = error.message ? error.message : 'Ocorreu um erro ao cadastrar produto.'
                showError('Erro', message)
            }
        }
    }

    // UTILS
    const _handleImageError = (e) => {
        e.target.src = fallBackImage;
    };

    const _clearForm = () => {
        setNome('');
        setPreco('');
        setUrlImagem('');
    }

    // EFFECTS
    useEffect(() => {
        findAll();
    }, []);

    useEffect(() => {
        findByName(nomeProduto);
    }, [nomeProduto]);

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
                    <h4 className="page-title">Produtos</h4>
                </div>
            </div>

            <div className="d-flex border p-4 py-4 custom-content">

                <div className="col me-3">
                    <InputGroup>
                        <Form.Control 
                            type="text"
                            className="text-center" 
                            placeholder="Consulte o produto pelo nome"
                            value={nomeProduto}
                            onChange={(e) => setNomeProduto(e.target.value)}
                        />
                    </InputGroup>
                </div>

                <div className="d-flex">
                    <Button key={"button-1"} className="default-button" onClick={() => {
                        _clearForm();
                        showSaveModal();
                    }}
                    >
                        Novo Produto
                    </Button>
                </div>
            </div>

            { produtos.length > 0 
            ?
            (
                <div className="d-flex flex-wrap justify-content-center pt-4">
                    {produtos.map((produto) => {
                        return (
                            <div className="justify-content-center">
                                <Card style={{ width: '18rem', height: '23rem'}} key={produto.id} className="pedido-card m-3">
                                    <CardHeader>
                                        <div className="d-flex justify-content-end"> 
                                            <Button 
                                                key={"button-2"}
                                                className="default-button" 
                                                style={{ borderRadius: "50px" }} 
                                                onClick={() => {
                                                    setId(produto.id); 
                                                    setNome(produto.nome);
                                                    setPreco(produto.preco);
                                                    setUrlImagem(produto.urlImagem);
                                                    showEditModal();
                                                }}
                                            >
                                                <i className="fa-solid fa-pencil"></i> 
                                            </Button>
                                           
                                            
                                            <Button 
                                                className="cancel-button ms-2" 
                                                style={{ borderRadius: "50px" }}
                                                onClick={() => deleteProduto(produto)}
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </Button>
                                        </div>
                                    </CardHeader>
                                        <div className="d-flex justify-content-center">
                                            <Card.Img 
                                                variant="top" 
                                                className="img-fluid p-2" 
                                                style={{ objectFit: 'contain', width: '170px', height: '170px' }} 
                                                src={produto.urlImagem}
                                                onError={_handleImageError}
                                            />
                                        </div>
                                    <Card.Body> 
                                        <div className="d-flex flex-column justify-content-between h-100">
                                            <Card.Title className="text-center produto-card-title">
                                                {produto.nome}
                                            </Card.Title>
                                            <Card.Text className="text-center card-price">{maskMoney(produto.preco)}</Card.Text>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        );
                    }
                )}
                </div>
            )
            :
            (
                <div className="text-center pt-4 blank-message">
                    <p>Não foram encontrados produtos.</p>
                </div>
            )
            }

            <Modal show={saveModal} onHide={closeSaveModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Produto</Modal.Title>
                </Modal.Header> 
                    
                <Modal.Body className="p-4">
                    <Form onSubmit={saveProduto}>
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
                            <Form.Label>Preço</Form.Label>
                            <Form.Control 
                                type="number"
                                className="text-center"  
                                required
                                placeholder="123.45"
                                min={1}
                                max={999999.99}
                                step={0.01}
                                value={preco}
                                onChange={(e) => setPreco(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>URL da imagem</Form.Label>
                            <Form.Control 
                                type="text"
                                className="text-center"  
                                required
                                placeholder="https://imgs.casasbahia.com.br/1569778503/1xg.jpg"
                                value={urlImagem}
                                onChange={(e) => setUrlImagem(e.target.value)}
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
                    <Modal.Title>Editar produto</Modal.Title>
                </Modal.Header>
                
                <Modal.Body className="p-4">
                    <Form onSubmit={editProduto}>
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
                            <Form.Label>Preço</Form.Label>
                            <Form.Control 
                                type="number"
                                className="text-center"  
                                required
                                placeholder="123.45"
                                min={1}
                                max={999999.99}
                                step={0.01}
                                value={preco}
                                onChange={(e) => setPreco(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>URL da imagem</Form.Label>
                            <Form.Control 
                                type="text"
                                className="text-center"  
                                required
                                placeholder="https://imgs.casasbahia.com.br/1569778503/1xg.jpg"
                                value={urlImagem}
                                onChange={(e) => setUrlImagem(e.target.value)}
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

export default ProdutoPage