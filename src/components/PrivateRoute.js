// PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Importa o contexto de autenticação

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // Redireciona para a página de login se não estiver logado
    return <Navigate to="/" state={{ from: location }} replace />; 
  }

  return children;
};

export default PrivateRoute;