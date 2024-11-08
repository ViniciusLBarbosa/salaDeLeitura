import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Login/Home';
import Register from './components/Login/Register';
import Cadastro from './pages/Cadastro';
import Emprestimo from './pages/Emprestimo';
import './App.css';
import TabelaEmprestimo from './pages/Tabela';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />

        <Route path="/cadastro" element={<Layout><Cadastro /></Layout>} /> {/* Envolve cada rota com Layout */}
        <Route path="/emprestimo" element={<Layout><Emprestimo /></Layout>} />
        <Route path="/tabela" element={<Layout><TabelaEmprestimo /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;