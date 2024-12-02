import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import  '../styles.css';
import './tabela.css';

function ListaDeAlunos() {
  const [aluno, setAluno] = useState([]);
  const [livros, setLivros] = useState([]);
  const [alunosOriginais, setAlunosOriginais] = useState([]);
  const [ordenacao, setOrdenacao] = useState({ campo: 'nome', direcao: 'asc' });
  const [filtro, setFiltro] = useState({ campo: 'nome', valor: '' });

  const deletarAluno = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esse aluno?')) {
      try {
        await deleteDoc(doc(db, 'alunos', id));
        setAluno(aluno.filter(aluno => aluno.id !== id));
        setAlunosOriginais(alunosOriginais.filter(aluno => aluno.id !== id));
      } catch (error) {
        console.error('Erro ao deletar aluno:', error);
      }
    }
  };

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const alunosCollection = collection(db, 'alunos');
        const alunosSnapshot = await getDocs(alunosCollection);
        const alunosList = alunosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAluno(alunosList);
        setAlunosOriginais(alunosList);
      } catch (error) {
        console.error('Erro ao buscar aluno:', error);
      }
    };

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

    fetchAlunos();
    fetchLivros();
  }, []);

  const ordenarAlunos = (campo) => {
    setOrdenacao(prevOrdenacao => ({
      campo: campo,
      direcao: prevOrdenacao.campo === campo && prevOrdenacao.direcao === 'asc' ? 'desc' : 'asc'
    }));

    setAluno(prevAluno => [...prevAluno].sort((a, b) => {
      if (campo === 'serie') {
        return (a[campo] - b[campo]) * (ordenacao.direcao === 'asc' ? 1 : -1);
      } else {
        const valorA = a[campo].toLowerCase();
        const valorB = b[campo].toLowerCase();
        return valorA.localeCompare(valorB) * (ordenacao.direcao === 'asc' ? 1 : -1);
      }
    }));
  };

  const filtrarAlunos = () => {
    const { campo, valor } = filtro;
    const valorMinusculo = valor.toLowerCase();

    const alunosFiltrados = alunosOriginais.filter(aluno => {
      if (campo === 'livrosEmprestados') {
        const livrosDoAluno = livros.filter(livro => livro.alunoEmprestado === aluno.id);
        return livrosDoAluno.some(livro => livro.titulo.toLowerCase().includes(valorMinusculo));
      } else {
        return aluno[campo].toString().toLowerCase().includes(valorMinusculo);
      }
    });

    setAluno(alunosFiltrados);
  };

  return (
    <div>
      <div className='pesquisa-container'>
        <input
          type="text"
          placeholder="Pesquisar..."
          value={filtro.valor}
          onChange={(e) => setFiltro({ ...filtro, valor: e.target.value })}
        />
        <select value={filtro.campo} onChange={(e) => setFiltro({ ...filtro, campo: e.target.value })}>
          <option value="nome">Aluno</option>
          <option value="serie">Série</option>
          <option value="livrosEmprestados">Livros Emprestados</option>
        </select>
        <button onClick={filtrarAlunos}>Pesquisar</button>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => ordenarAlunos('nome')}>Aluno</th>
            <th onClick={() => ordenarAlunos('serie')}>Ano/Série</th>
            <th>Livros Emprestados</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {aluno.map((aluno) => (
            <tr key={aluno.id}>
              <td>{aluno.nome}</td>
              <td>{aluno.serie}</td>
              <td>
                <ul>
                  {livros
                    .filter(livro => livro.alunoEmprestado === aluno.id)
                    .map(livro => (
                      <li key={livro.id}>{livro.titulo}</li>
                    ))}
                </ul>
              </td>
              <td>
                <button className='botoes' onClick={() => deletarAluno(aluno.id)}>Remover Aluno</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaDeAlunos;