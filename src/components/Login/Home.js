import React, { useState } from 'react';
import { db } from '../../config/firebase';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './cadastro-login.css';

function Home() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try   
 {
      const usuariosRef = collection(db, 'usuarios');
      const q = query(usuariosRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty)   
 {
        alert('Usuário não encontrado.');
        return;
      }

      const usuario = querySnapshot.docs[0].data();

      if (usuario.senha !== senha) {
        alert('Senha incorreta.');
        return;
      }

      navigate('/cadastro');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login.');
    }
  };

  return (
    <div className="container">
      <h1>Bem-vindo(a)!</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      <p>
        Não tem uma conta? <Link to="/Register">Cadastre-se</Link>
      </p>
      <p>
      <Link to="/">Esqueceu sua senha?</Link>
      </p>
    </div>
  );
}

export default Home;