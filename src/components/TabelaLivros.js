import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles.css';
import './tabela.css'

function TabelaLivros() {
  const [livros, setLivros] = useState([]);
  const [ordenacao, setOrdenacao] = useState({ campo: 'titulo', direcao: 'asc' });
  const [alunos, setAlunos] = useState([]);

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
        const livroDoc = await getDoc(livroRef); // Busca o documento do livro

        // Verifica se o documento do livro existe
        if (livroDoc.exists()) {
          const alunoId = livroDoc.data().alunoEmprestado; // Obtém o ID do aluno
          console.log("ID do aluno:", alunoId);

          // Atualiza o documento do livro
          await updateDoc(livroRef, { emprestado: false, alunoEmprestado: '', serie: '' });

          // Remove o livro da lista de livrosEmprestados do aluno
          const alunoRef = doc(db, 'alunos', alunoId);
          await updateDoc(alunoRef, { 
            livrosEmprestados: arrayRemove(id) 
          });

          setLivros(livros.map(livro =>
            livro.id === id ? { ...livro, emprestado: false, alunoEmprestado: '', serie: '' } : livro
          ));
        } else {
          console.error('Documento do livro não encontrado.');
        }

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
   
    const fetchAlunos = async () => { // Função para buscar alunos
      try {
        const alunosCollection = collection(db, 'alunos');
        const alunosSnapshot = await getDocs(alunosCollection);
        const alunosList = alunosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAlunos(alunosList);
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
      }
    };

    fetchLivros();
    fetchAlunos(); // Chama a função para buscar alunos
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
            <td>
              {livro.emprestado // Exibe o nome do aluno, se encontrado
                ? alunos.find(aluno => aluno.id === livro.alunoEmprestado)?.nome || "Aluno não encontrado" 
                : ""}
            </td>
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