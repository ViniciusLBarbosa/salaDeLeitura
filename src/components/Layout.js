import { useLocation, Link } from 'react-router-dom';
import BotaoLogout from './Login/BotaoLogout';
import './Layout.css';

function Layout({ children }) { // Recebe children como prop
  const location = useLocation();

  return (
    <div>
      {location.pathname !== '/' && location.pathname !== '/register' && (
        <nav>
          <ul className='navigation'>
            <li>
              <Link to="/cadastro">Cadastro de Livros</Link>
            </li>
            <li>
              <Link to="/emprestimo">Empréstimo de Livros</Link>
            </li>
            <li>
              <Link to="/tabela">Lista de Livros</Link>
            </li>
            <li>
              <BotaoLogout />
            </li>
          </ul>
        </nav>
      )}

      {children} {/* Mostra o conteúdo das rotas filhas */}
    </div>
  );
}

export default Layout;