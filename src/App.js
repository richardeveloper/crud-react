import './App.css';

import HomePage from './pages/HomePage.js'
import ProdutoPage from './pages/ProdutoPage.js'
import ClientePage from './pages/ClientePage.js';
import LayoutPage from './pages/LayoutPage.js';
import CadastrarPedidoPage from './pages/CadastrarPedidoPage.js';
import ConsultarPedidosPage from './pages/ConsultarPedidosPage.js';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutPage></LayoutPage>}>
          <Route path='/' element={<HomePage></HomePage>}></Route>
          <Route path='/produtos' element={<ProdutoPage></ProdutoPage>}></Route>
          <Route path='/clientes' element={<ClientePage></ClientePage>}></Route>
          <Route path='/pedidos/consulta/:clienteId?' element={<ConsultarPedidosPage></ConsultarPedidosPage>}></Route>
          <Route path='/pedidos/cadastro' element={<CadastrarPedidoPage></CadastrarPedidoPage>}></Route>  
        </Route>        
      </Routes>
    </BrowserRouter>
  );
} 

export default App;
