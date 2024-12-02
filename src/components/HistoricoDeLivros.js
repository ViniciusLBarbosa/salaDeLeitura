import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles.css';
import './tabela.css'


function HistoricoDeLivros() {
  const [aluno, setAluno] = useState([]);
  const [livros, setLivros] = useState([]);
  const [ordenacao, setOrdenacao] = useState({ campo: 'nome', direcao: 'asc' }); // Campo inicial: 'nome'

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const alunosCollection = collection(db, 'alunos');
        const alunosSnapshot = await getDocs(alunosCollection);
        const alunosList = alunosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAluno(alunosList);
      } catch (error) {
        console.error('Erro ao buscar aluno:', error);
      }
    };
    
    const fetchLivros = async () => { // Função para buscar livros
      try {
        const livrosCollection = collection(db, 'livros');
        const livrosSnapshot = await getDocs(livrosCollection);
        const livrosList = livrosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLivros(livrosList);
      } catch (error) {
        console.error('Erro ao buscar livros:', error);
      }
    };

    fetchAlunos();
    fetchLivros(); // Chama a função para buscar livros
  }, []);

  const ordenarAlunos = (campo) => {
    setOrdenacao(prevOrdenacao => ({
      campo: campo,
      direcao: prevOrdenacao.campo === campo && prevOrdenacao.direcao === 'asc' ? 'desc' : 'asc'
    }));

    setAluno(prevAluno => [...prevAluno].sort((a, b) => {
      if (campo === 'serie') { // Ordenação numérica para 'serie'
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
          <th onClick={() => ordenarAlunos('nome')}>Aluno</th> {/* Ordenar por 'nome' */}
          <th onClick={() => ordenarAlunos('serie')}>Ano/Série</th> {/* Ordenar por 'serie' */}
          <th>Histórico de Livros</th>
          <th>Quantidade de Livros no Histórico</th>
        </tr>
      </thead>
      <tbody>
        {aluno.map((aluno) => (
          <tr key={aluno.id}>
            <td>{aluno.nome}</td> {/* Exibir 'nome' */}
            <td>{aluno.serie}</td> {/* Exibir 'serie' */}
            <td>
            <ul> 
                {aluno.historicoDeLivros && aluno.historicoDeLivros.length > 0 ? ( // Verifica se o array existe e não está vazio
                  livros
                    .filter(livro => aluno.historicoDeLivros.includes(livro.id)) // Filtra os livros pelo ID
                    .map(livro => (
                      <li key={livro.id}>{livro.titulo}</li>
                    ))
                ) : (
                  <li>Nenhum livro no histórico</li> // Mensagem caso não haja livros no histórico
                )}
              </ul>
            </td>
            <td>{aluno.historicoDeLivros ? aluno.historicoDeLivros.length : 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default HistoricoDeLivros;