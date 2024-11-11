import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Login/Home';
import Register from './components/Login/Register';
import Cadastro from './pages/Cadastro';
import Emprestimo from './pages/Emprestimo';
import Alunos from './pages/Alunos'
import './App.css';
import TabelaEmprestimo from './pages/Tabela';
import Layout from './components/Layout';
import ListaDeAluno from './pages/Lista';
import PrivateRoute from './components/PrivateRoute'; // Importe o PrivateRoute
import { AuthProvider } from './components/AuthContext'; // Importe o AuthProvider

function App() {
  return (
    <AuthProvider> {/* Envolve o aplicativo com AuthProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Register" element={<Register />} />

          {/* Protege as rotas com PrivateRoute */}
          <Route path="/alunos" element={
            <PrivateRoute>
              <Layout><Alunos /></Layout>
            </PrivateRoute>
          } />
          <Route path="/lista" element={
            <PrivateRoute>
              <Layout><ListaDeAluno /></Layout>
            </PrivateRoute>
          } />
          <Route path="/cadastro" element={
            <PrivateRoute>
              <Layout><Cadastro /></Layout>
            </PrivateRoute>
          } /> 
          <Route path="/emprestimo" element={
            <PrivateRoute>
              <Layout><Emprestimo /></Layout>
            </PrivateRoute>
          } />
          <Route path="/tabela" element={
            <PrivateRoute>
              <Layout><TabelaEmprestimo /></Layout>
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;