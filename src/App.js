import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import Cadastro from './pages/Cadastro';
import Emprestimo from './pages/Emprestimo';
import Alunos from './pages/Alunos'
import Home from './components/Home'
import './App.css';
import TabelaEmprestimo from './pages/Tabela';
import Layout from './components/Layout';
import ListaDeAluno from './pages/Lista';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './components/AuthContext';
import HistoricoDeLivros from './pages/Historico';

function App() {
  return (
    <AuthProvider> {/* Envolve o aplicativo com AuthProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<Register />} />

          {/* Protege as rotas com PrivateRoute */}
          <Route path="/home" element={ 
            <PrivateRoute>
              <Layout><Home /></Layout> 
            </PrivateRoute>
         } /> 
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
          <Route path="/historico" element={
            <PrivateRoute>
              <Layout><HistoricoDeLivros /></Layout>
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