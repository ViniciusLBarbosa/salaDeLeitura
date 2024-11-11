import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Importe as funções do Firebase Authentication
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './cadastro-login.css';

function Home() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();
  const auth = getAuth(); // Inicializa o Firebase Authentication

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Autenticar o usuário com Firebase Authentication
      await signInWithEmailAndPassword(auth, email, senha);

      // Redirecionar para a página protegida após o login
      navigate('/cadastro'); 
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="container">
      <h1>Bem-vindo(a)!</h1>
      <h2>Sala de Leitura</h2>
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
        <Link to="/">Esqueceu sua senha?</Link>
      </p>
      <footer>Developed by <a href='https://github.com/ViniciusLBarbosa?tab=repositories'>Vinícius Lima</a> </footer>
    </div>
  );
}

export default Home;