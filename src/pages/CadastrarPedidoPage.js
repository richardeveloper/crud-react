import React, { useEffect, useState } from "react";
import { Button, Card, CardHeader, Container, Dropdown, Form, Image, InputGroup, ListGroup, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingComponent from "../components/LoadingComponent";
import { masksHelper } from "../helpers/masksHelper";
import { apiRequest } from "../hooks/apiRequest";

const apiUrl = process.env.REACT_APP_API_URL;
const fallBackImage = process.env.REACT_APP_URL_IMAGE_NOT_FOUND;

const CadastrarPedidoPage = () => {

    // HOOKS
    const { applyMaskMoney, applyMaskPhone } = masksHelper();
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [isLoading, setIsLoading] = useState(true);

    // PAGE
    const [clientes, setClientes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [carrinho, setCarrinho] = useState([]);
    const [totalPedido, setTotalPedido] = useState(0);

    const [clienteSelecionado, setClienteSelecionado] = useState();

    const [nomeProduto, setNomeProduto] = useState('');

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

    const findAllProdutos = async () => {
        setIsLoading(true);

        let data;

        try {
            data = await apiRequest(`${apiUrl}/produtos`);
            console.log(data);

        }
        catch (error) {
            setIsLoading(false);
            return;
        }

        setProdutos(data);

        setIsLoading(false);
    }

    const findProdutoByName = async (nomeProduto) => {
        setIsLoading(true);

        let data;

        try {
            data = await apiRequest(`${apiUrl}/produtos/nome?nome=${nomeProduto}`);
            console.log(data);
        }
        catch (error) {
            setIsLoading(false);
            return;
        }

        setProdutos(data);

        setIsLoading(false);
    }

    const savePedido = async () => {

        if (!clienteSelecionado) {
            toast.warning('É necessário selecionar um cliente para finalizar o pedido.');
            return;
        }

        if (carrinho.length === 0) {
            toast.warning('É necessário selecionar ao menos um produto para finalizar o pedido.');
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
            await apiRequest(`${apiUrl}/pedidos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pedido)
            });
        }
        catch (error) {
            setIsLoading(false);
            return;
        }

        _clearForm();

        setIsLoading(false);

        window.scrollTo(0, 0);

        toast.success('Pedido cadastrado com sucesso.');
    }

    // UTILS
    const _addProduto = async (produto) => {

        let novoCarrinho = [];

        if (carrinho.length > 0) {
            novoCarrinho = carrinho.map((item) => {
                return item;
            });
        }

        novoCarrinho.push(produto);

        _calcularValorTotalPedido(novoCarrinho);
        setCarrinho(novoCarrinho);

        toast.success(`${produto.nome} foi adicionado do carrinho.`);
    }

    const _removeProduto = async (produto) => {

        let novoCarrinho = [];

        if (carrinho.length > 0) {
            novoCarrinho = carrinho.filter((e) => e.id !== produto.id);
        }

        _calcularValorTotalPedido(novoCarrinho);
        setCarrinho(novoCarrinho);

        toast.success(`${produto.nome} foi removido do carrinho.`);
    }

    const _calcularValorTotalPedido = (carrinho) => {
        const totalPedido = carrinho.reduce((acc, item) => {
            return acc + item.preco;
        }, 0);

        setTotalPedido(applyMaskMoney(totalPedido));
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
        setNomeProduto('');
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
                    <h4 className="page-title">Cadastrar pedido</h4>
                </div>
            </div>

            <div>
                <div className="border p-4 py-4 custom-content">

                        <div className="d-flex justify-content-center">
                            <Dropdown className="d-inline">
                                <Dropdown.Toggle size="md" id="dropdown-autoclose-true" className="custom-dropdown-toggle default-button">
                                    Selecione o cliente
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="custom-dropdown-toggle">
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
                                            <ListGroup.Item><strong>Telefone: </strong> {applyMaskPhone(clienteSelecionado.telefone)}</ListGroup.Item>
                                            <ListGroup.Item><strong>Data de Cadastro: </strong> {clienteSelecionado.dataCadastro}</ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </div>
                        )
                        :
                        (
                            <div className="text-center pt-4 blank-message">
                                <p>Nenhum cliente selecionado.</p>
                            </div>
                        )
                        }
                    </div>

                    <div className="border p-4 my-4 custom-content">
                        <h4 className="text-center py-3 pedido-section-title">
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
                                                <Card style={{ width: '18rem', height: '24rem'}} key={produto.id} className="pedido-card m-3">
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
                                                            <Card.Title className="text-center pedido-card-title">
                                                                {produto.nome}
                                                            </Card.Title>
                                                            <Card.Text className="text-center card-price">
                                                                {applyMaskMoney(produto.preco)}
                                                            </Card.Text>
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

                                    {/* PREENCHER A LINHA COM CARDS VAZIOS SE NECESSARIO */}
                                    {(() => {
                                        const totalProdutos = produtos.length;
                                        const produtosPorLinha = _slidesPerRow();
                                        
                                        const cardsVazios = totalProdutos % produtosPorLinha === 0 ? 0 : produtosPorLinha - (totalProdutos % produtosPorLinha);

                                        if (totalProdutos < produtosPorLinha && totalProdutos !== 0) {
                                            return Array.from({ length: cardsVazios }).map((_, index) => (
                                                <div className="d-flex justify-content-center pb-4" style={{ flexDirection: "row" }} key={`empty-${index}`}>
                                                    <div style={{ width: '18rem', height: '24rem' }}></div>
                                                </div>
                                            ));
                                        }

                                        return null;
                                    })()}

                                </Slider>
                            </div>
                        )
                        :
                        (
                            <div className="text-center pt-4 blank-message">
                                <p>Não foram encontrados produtos.</p>
                            </div>
                        )
                        }
                    </div>

                    <div className="border p-4 my-4 custom-content">
                        <h4 className="text-center py-3 pedido-section-title">
                            Meu Carrinho
                        </h4>

                        { carrinho.length > 0
                        ? 
                        (
                            <div>
                                <Table responsive striped bordered hover size="sm">
                                    <thead className='text-center'>
                                        <tr>
                                            <th className="table-content-info">ID</th>
                                            <th className="table-content-info">Nome</th>
                                            <th className="table-content-info">Preço</th>
                                            <th>Opções</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-center'>
                                        {carrinho.map((produto) => {
                                            return (
                                            <tr>
                                                <td className="align-middle table-content-info">
                                                    {produto.id}
                                                </td>
                                                <td className="align-middle table-content-info">
                                                    {produto.nome}
                                                </td>
                                                <td className="align-middle table-content-info">
                                                    {applyMaskMoney(produto.preco)}
                                                    </td>
                                                <td className="align-middle">
                                                    <Button className="cancel-button" onClick={() => _removeProduto(produto)}>
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                            ); 
                                        })}
                                    </tbody>
                                </Table>
                                <div className="border d-flex justify-content-around pt-3 mt-2" style={{ backgroundColor: "#F2F2F2"}}>
                                            <p style={{ fontSize: "20px" }}>
                                                VALOR TOTAL DO PEDIDO
                                            </p>
                                            <p style={{ fontSize: "20px" }}>
                                                {totalPedido}
                                            </p>
                                        </div>
                                </div>
                            )
                        :
                        (
                            <div className="text-center pt-4 blank-message">
                                <p>O carrinho se encontra vazio.</p>
                            </div>
                        )
                        }
                    </div>
                    
                    <div className="border p-4 my-4 custom-content">
                        <h4 className="text-center py-3 pedido-section-title">
                            Confirmação
                        </h4>
                        <div className="d-flex justify-content-center">
                            <Button className="confirm-button mx-2" onClick={() => savePedido()}>
                                Finalizar Pedido    
                            </Button>
                            <Button className="cancel-button mx-2" onClick={() => _clearForm()}>
                                Limpar
                            </Button>
                        </div>
                    </div>
            </div>
        </Container>
    );
}

export default CadastrarPedidoPage