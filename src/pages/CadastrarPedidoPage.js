import React, { useState, useEffect } from "react";

import { Button, Card, CardHeader, Container, Dropdown, Form, InputGroup, ListGroup, Table, Image } from "react-bootstrap";
import { masksHelper } from "../helpers/masksHelper";
import { useToast } from "../hooks/useToast";

import ToastComponent from "../components/ToastComponent";
import Slider from "react-slick";
import LoadingComponent from "../components/LoadingComponent";
import { Link } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;
const fallBackImage = process.env.REACT_APP_URL_IMAGE_NOT_FOUND;

const CadastrarPedidoPage = () => {

    // HOOKS
    const { maskMoney, maskPhone } = masksHelper();
    const { showToast, closeToast, title, message, background, showSuccess, showError, showWarning } = useToast();
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [isLoading, setIsLoading] = useState(true);

    // PAGE
    const [clientes, setClientes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [carrinho, setCarrinho] = useState([]);

    const [clienteSelecionado, setClienteSelecionado] = useState();

    const [nomeProduto, setNomeProduto] = useState('');

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
                const message = error.message ? error.message : 'Ocorreu um erro ao buscar clientes.';
                showError('Erro', message)
            }
        }
    }

    const findAllProdutos = async () => {
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

    const findProdutoByName = async (nomeProduto) => {
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

    const save = async () => {
        if (!clienteSelecionado) {
            showWarning('Aviso', 'É necessário selecionar um cliente para finalizar o pedido.');
            return;
        }

        if (carrinho.length === 0) {
            showWarning('Aviso', 'É necessário selecionar ao menos um produto para finalizar o pedido.');
            return;
        }

        const produtoIds = carrinho.map((produto) => {
            return produto.id;
        });

        const pedido = {
            clienteId: clienteSelecionado.id,
            produtoIds: produtoIds
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/pedidos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pedido)
            });

            if (!response.ok) {
                const dataError = await response.json();
                console.log(dataError);
                throw dataError;
            }
            
            const data = await response.json();
            console.log(data);

            _clearForm();

            setIsLoading(false);

            window.scrollTo(0, 0);

            showSuccess('Sucesso.', 'Pedido cadastrado com sucesso.');
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
                const message = error.message ? error.message : 'Ocorreu um erro ao cadastrar o pedido.'
                showError('Erro', message)
            }
        }
    }

    // UTILS
    const _addProduto = (produto) => {
        let novoCarrinho = [];

        if (carrinho.length > 0) {
            novoCarrinho = carrinho.map((item) => {
                console.log(item);
                return item;
            });
        }

        novoCarrinho.push(produto);
        
        console.log(novoCarrinho)
        setCarrinho(novoCarrinho);

        showSuccess('Sucesso', produto.nome + ' foi adicionado ao carrinho.');
    }

    const _removeProduto = (produto) => {
        let novoCarrinho = [];

        if (carrinho.length > 0) {
            novoCarrinho = carrinho.filter((e) => e.id !== produto.id);
        }

        setCarrinho(novoCarrinho);

        showSuccess('Sucesso', produto.nome + ' foi removido do carrinho.');
    }

    const _slidesPerRow = () => {
        if (screenWidth >= 1390) {
          return 4;
        } 
        else if (screenWidth >= 980) {
          return 3;
        } 
        else if (screenWidth >= 770) {
            return 2;
          } 
        else {
          return 1;
        }
    };

    const _clearForm = () => {
        setClienteSelecionado();
        setCarrinho([]);
    }

    const _handleImageError = (e) => {
        e.target.src = fallBackImage;
    };

    // EFFECTS
    useEffect(() => {
        findAllClientes();
        findAllProdutos();
    }, []);

    useEffect(() => {
        findProdutoByName(nomeProduto);
    }, [nomeProduto]);

    useEffect(() => {
        const handleResize = () => {
          setScreenWidth(window.innerWidth);
        };
    
        window.addEventListener("resize", handleResize);
    
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);

    return (
        <Container>
            <LoadingComponent isLoading={isLoading}></LoadingComponent>

            <div className="border content-title my-4 py-2">
                <div className="d-flex justify-content-start align-items-center">
                    <Link to={'/'}>
                        <Image 
                            src="/back.png" 
                            height={28} 
                            className="back-icon mx-4"
                        ></Image>
                    </Link>
                    <h4 className="pt-2">CADASTRAR PEDIDO</h4>
                </div>
            </div>

            <div>
                <div className="border p-4 py-4 custom-content">

                        <div className="d-flex justify-content-center">
                            <Dropdown className="d-inline mx-2">
                                <Dropdown.Toggle size="md" id="dropdown-autoclose-true" className="custom-dropdown-toggle default-button">
                                    Selecione o cliente
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {clientes.map((cliente) => {
                                        return (
                                            <Dropdown.Item 
                                                onClick={() => setClienteSelecionado(cliente)} 
                                                key={cliente.id} 
                                                eventKey={cliente.id} 
                                                className="custom-dropdown-item"
                                            > 
                                            {cliente.nome}
                                            </Dropdown.Item>        
                                        );
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        {clienteSelecionado
                        ?
                        (
                            <div className="d-flex justify-content-center pt-3">
                                <Card style={{ width: '24rem' }} key={clienteSelecionado.id} className="pedido-card m-4">
                                    <CardHeader>
                                        <Card.Title className="pt-2">
                                            {clienteSelecionado.nome}
                                        </Card.Title>
                                    </CardHeader>
                                    <ListGroup className="list-group-flush">
                                            <ListGroup.Item><strong>ID: </strong> {clienteSelecionado.id}</ListGroup.Item>
                                            <ListGroup.Item><strong>E-mail: </strong> {clienteSelecionado.email}</ListGroup.Item>
                                            <ListGroup.Item><strong>Telefone: </strong> {maskPhone(clienteSelecionado.telefone)}</ListGroup.Item>
                                            <ListGroup.Item><strong>Data de Cadastro: </strong> {clienteSelecionado.dataCadastro}</ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </div>
                        )
                        :
                        (
                            <div className="text-center pt-4">
                                <p>Nenhum cliente selecionado.</p>
                            </div>
                        )
                        }
                    </div>

                    <div className="border p-4 my-4 custom-content">
                        <h4 className="text-center py-3">
                            Produtos Disponíveis
                        </h4>

                        <div className="py-4">
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

                        { produtos.length > 0
                        ?
                        (
                            <div className="slider-container pb-5">
                                <Slider 
                                    dots={true}
                                    centerPadding="10px" 
                                    slidesToShow={_slidesPerRow()} 
                                    slidesToScroll={_slidesPerRow()} 
                                    infinite={false}
                                >
                                    {produtos.map((produto) => {
                                        return (
                                            <div className="d-flex justify-content-center pb-4" style={{ flexDirection: "row" }}>
                                                <Card style={{ width: '18rem', height: '23rem'}} key={produto.id} className="pedido-card m-3">
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
                                                            <Card.Title className="text-center">{produto.nome}</Card.Title>
                                                            <Card.Text className="text-center card-price">{maskMoney(produto.preco)}</Card.Text>
                                                            <div className="d-flex justify-content-center">
                                                                <Button className="default-button" onClick={() => _addProduto(produto)}>
                                                                    Adicionar ao carrinho
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        );
                                    })}

                                    {/* Card vazio */}
                                    {Array.from({ length: _slidesPerRow() - produtos.length % _slidesPerRow() }).map((_, index) => (
                                        <div className="d-flex justify-content-center pb-4" style={{ flexDirection: "row" }} key={`empty-${index}`}>
                                            <div style={{ width: '18rem', height: '23rem' }}></div>
                                        </div>
                                    ))}

                                </Slider>
                            </div>
                        )
                        :
                        (
                            <div className="text-center pt-4">
                                <p>Não foram encontrados produtos.</p>
                            </div>
                        )
                        }
                    </div>

                    <div className="border p-4 my-4 custom-content">
                        <h4 className="text-center py-3">
                            Meu Carrinho
                        </h4>

                        { carrinho.length > 0
                        ? 
                        (
                            <Table responsive striped bordered hover size="sm">
                                <thead className='text-center'>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Preço</th>
                                        <th>Opções</th>
                                    </tr>
                                </thead>
                                <tbody className='text-center'>
                                    {carrinho.map((produto) => {
                                        return (
                                        <tr>
                                            <td>{produto.id}</td>
                                            <td>{produto.nome}</td>
                                            <td>{maskMoney(produto.preco)}</td>
                                            <td>
                                                <Button className="cancel-button" onClick={() => _removeProduto(produto)}>
                                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                        ); 
                                    })}
                                </tbody>
                            </Table>)
                        :
                        (
                            <div className="text-center pt-4">
                                <p>O carrinho se encontra vazio.</p>
                            </div>
                        )
                        }
                    </div>
                    
                    <div className="border p-4 my-4 custom-content">
                        <h4 className="text-center py-3">
                            Confirmação
                        </h4>
                        <div className="d-flex justify-content-center">
                            <Button className="confirm-button mx-2" onClick={() => save()}>
                                Finalizar Pedido    
                            </Button>
                            <Button className="cancel-button mx-2" onClick={() => _clearForm()}>
                                Limpar
                            </Button>
                        </div>
                    </div>
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

export default CadastrarPedidoPage