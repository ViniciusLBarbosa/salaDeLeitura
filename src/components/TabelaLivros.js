import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles.css';

function TabelaLivros() {
  const [livros, setLivros] = useState([]);
  const [ordenacao, setOrdenacao] = useState({ campo: 'titulo', direcao: 'asc' });

  const deletarLivro = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esse livro?')) {
      try {
        await deleteDoc(doc(db, 'livros', id));
        setLivros(livros.filter(livro => livro.id !== id));
      } catch (error) {
        console.error('Erro ao deletar livro:', error);
      }
    }
  };

  const devolverLivro = async (id) => {
    if (window.confirm('Tem certeza que deseja devolver esse livro?')) {
      try {
        const livroRef = doc(db, 'livros', id);
        await updateDoc(livroRef, { emprestado: false, alunoEmprestado: '', serie: '' });

        setLivros(livros.map(livro =>
          livro.id === id ? { ...livro, emprestado: false, alunoEmprestado: '', serie: '' } : livro
        ));
      } catch (error) {
        console.error('Erro ao devolver livro:', error);
      }
    }
  };

  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const livrosCollection = collection(db, 'livros');
        const livrosSnapshot = await getDocs(livrosCollection);
        const livrosList = livrosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLivros(livrosList);
      } catch (error) {
        console.error('Erro ao buscar livros:', error);
      }
    };

    fetchLivros();
  }, []);

  const ordenarLivros = (campo) => {
    setOrdenacao(prevOrdenacao => ({
      campo: campo,
      direcao: prevOrdenacao.campo === campo && prevOrdenacao.direcao === 'asc' ? 'desc' : 'asc'
    }));

    setLivros(prevLivros => [...prevLivros].sort((a, b) => {
      if (campo === 'numeroTombo') {
        return (a[campo] - b[campo]) * (ordenacao.direcao === 'asc' ? 1 : -1);
      } else {
        const valorA = a[campo].toLowerCase();
        const valorB = b[campo].toLowerCase();
        return valorA.localeCompare(valorB) * (ordenacao.direcao === 'asc' ? 1 : -1);
      }
    }));
  };

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => ordenarLivros('titulo')}>Título</th>
          <th onClick={() => ordenarLivros('autor')}>Autor</th>
          <th onClick={() => ordenarLivros('numeroTombo')}>Número Tombo</th>
          <th>Emprestado</th>
          <th>Aluno</th>
          <th>Ano/Série</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {livros.map((livro) => (
          <tr key={livro.id}>
            <td>{livro.titulo}</td>
            <td>{livro.autor}</td>
            <td>{livro.numeroTombo}</td>
            <td>{livro.emprestado ? 'Sim' : 'Não'}</td>
            <td>{livro.alunoEmprestado}</td>
            <td>{livro.serie}</td>
            <td>
              {livro.emprestado && (
                <button className='botoes' onClick={() => devolverLivro(livro.id)}>Devolver</button>
              )}
              <button className='botoes' onClick={() => deletarLivro(livro.id)}>Remover</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TabelaLivros;
