import React, { useEffect, useState } from "react";

import { Button, Card, Container, Form, InputGroup, Modal } from "react-bootstrap";

import { masksHelper } from "../helpers/masksHelper";
import { useToast } from "../hooks/useToast";

import ToastComponent from "../components/ToastComponent";
import LoadingComponent from "../components/LoadingComponent";

const apiUrl = process.env.REACT_APP_API_URL;
const fallBackImage = process.env.REACT_APP_URL_IMAGE_NOT_FOUND;

const ProdutoPage = () => {

    //HOOKS
    const { maskMoney } = masksHelper();
    const { showToast, closeToast, title, message, background, showSuccess, showError, showWarning } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    //MODAL
    const [modal, setModal] = useState(false);
    const closeModal = () => setModal(false);
    const showModal = () => setModal(true);

    // PAGE
    const [produtos, setProdutos] = useState([]);

    const [nomeProduto, setNomeProduto] = useState('');

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

    const save = async (event) => {
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

            setNome('');
            setPreco('');
            setUrlImagem('');
            setModal(false);

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

    //UTILS
    const handleImageError = (e) => {
        e.target.src = fallBackImage;
    };

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

            <div className="py-4">
                <div className="d-flex justify-content-center align-items-center">
                    <i className="fa fa-tags me-2 pb-1" style={{ fontSize: "30px" }} aria-hidden="true"></i>   
                    <h2>Produtos</h2>
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

                <div>
                    <Button className="default-button" onClick={showModal}>
                        Novo produto
                    </Button>

                    <Modal show={modal} onHide={closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Cadastrar Produto</Modal.Title>
                        </Modal.Header>
                        
                        <Modal.Body>
                            <Form onSubmit={save}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        className="text-center" 
                                        required
                                        placeholder="Digite o nome do produto"
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
                                        placeholder="Digite o preço do produto"
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
                                        placeholder="Digite a url da imagem"
                                        value={urlImagem}
                                        onChange={(e) => setUrlImagem(e.target.value)}
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

            { produtos.length > 0 
            ?
            (
                <div className="d-flex flex-wrap justify-content-center pt-4">
                    {produtos.map((produto) => {
                        return (
                            <div className="justify-content-center">
                                <Card style={{ width: '17rem', height: '20rem'}} key={produto.id} className="m-3">
                                        <div className="d-flex justify-content-center">
                                            <Card.Img 
                                                variant="top" 
                                                className="img-fluid p-2" 
                                                style={{ objectFit: 'contain', width: '170px', height: '170px' }} 
                                                src={produto.urlImagem}
                                                onError={handleImageError}
                                            />
                                        </div>
                                    <Card.Body>
                                        <div className="d-flex flex-column justify-content-between h-100">
                                            <Card.Title className="text-center">{produto.nome}</Card.Title>
                                            <Card.Text className="text-center">{maskMoney(produto.preco)}</Card.Text>
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
                <div className="text-center pt-4">
                    <p>Não foram encontrados produtos.</p>
                </div>
            )
            }

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