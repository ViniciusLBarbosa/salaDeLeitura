import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Cadastro from './pages/Cadastro';
import Emprestimo from './pages/Emprestimo';
import './styles.css'
import TabelaEmprestimo from './pages/Tabela';

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/cadastro">Cadastro de Livros</Link>
            </li>
            <li>
              <Link to="/emprestimo">Empréstimo de Livros</Link>
            </li>
            <li>
              <Link to="/tabela">Tabela de Livros</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/emprestimo" element={<Emprestimo />} />
          <Route path="/tabela" element={<TabelaEmprestimo />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;