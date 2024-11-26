import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, arrayRemove, getDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles.css';
import './tabela.css';
import './pesquisa.css';

function TabelaLivros() {
  const [livros, setLivros] = useState([]);
  const [livrosFiltrados, setLivrosFiltrados] = useState([]);
  const [ordenacao, setOrdenacao] = useState({ campo: 'titulo', direcao: 'asc' });
  const [alunos, setAlunos] = useState([]);
  const [filtro, setFiltro] = useState({ campo: 'titulo', valor: '' });

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
        const livroDoc = await getDoc(livroRef);

        if (livroDoc.exists()) {
          const alunoId = livroDoc.data().alunoEmprestado;

          const emprestimosRef = collection(db, 'emprestimos');
          const q = query(emprestimosRef, where('livroId', '==', id), where('alunoId', '==', alunoId));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const emprestimoId = querySnapshot.docs[0].id;
            const emprestimoRef = doc(db, 'emprestimos', emprestimoId);

            await deleteDoc(emprestimoRef);

            await updateDoc(livroRef, { emprestado: false, alunoEmprestado: '', serie: '' });

            const alunoRef = doc(db, 'alunos', alunoId);
            await updateDoc(alunoRef, { livrosEmprestados: arrayRemove(id) });

            setLivros(livros.map(livro =>
              livro.id === id ? { ...livro, emprestado: false, alunoEmprestado: '', serie: '' } : livro
            ));
          } else {
            console.error('Empréstimo não encontrado.');
          }
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
    
    const fetchAlunos = async () => {
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
    fetchAlunos();
  }, []);

  useEffect(() => {
    setLivrosFiltrados(livros);
  }, [livros, filtro]);

  const handleChangeFiltro = (e) => {
    setFiltro({ ...filtro, valor: e.target.value });
  };

  const handleSelectFiltro = (e) => {
    setFiltro({ ...filtro, campo: e.target.value, valor: '' });
  };

  const filtrarLivros = () => {
    const { campo, valor } = filtro;
    const valorMinusculo = valor.toLowerCase();

    const livrosFiltrados = livros.filter(livro => {
      if (campo === 'aluno') {
        const aluno = alunos.find(aluno => aluno.id === livro.alunoEmprestado);
        return aluno?.nome.toLowerCase().includes(valorMinusculo);
      } else {
        return livro[campo].toLowerCase().includes(valorMinusculo);
      }
    });

    setLivrosFiltrados(livrosFiltrados);
  };

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
    <div>
      <div className='pesquisa-container'> 
        <input
          type="text"
          placeholder="Pesquisar..."
          value={filtro.valor}
          onChange={handleChangeFiltro}
        />
        <select value={filtro.campo} onChange={handleSelectFiltro}>
          <option value="titulo">Título</option>
          <option value="autor">Autor</option>
          <option value="genero">Gênero</option>
          <option value="editora">Editora</option>
          <option value="numeroTombo">Número Tombo</option>
          <option value="aluno">Aluno</option>
        </select>
        <button onClick={filtrarLivros}>Pesquisar</button>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => ordenarLivros('titulo')}>Título</th>
            <th onClick={() => ordenarLivros('autor')}>Autor</th>
            <th>Gênero</th>
            <th>Editora</th>
            <th onClick={() => ordenarLivros('numeroTombo')}>Número Tombo</th>
            <th>Emprestado</th>
            <th>Aluno</th>
            <th>Ano/Série</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {livrosFiltrados.map((livro) => (
            <tr key={livro.id}>
              <td>{livro.titulo}</td>
              <td>{livro.autor}</td>
              <td>{livro.genero}</td>
              <td>{livro.editora}</td>
              <td>{livro.numeroTombo}</td>
              <td>{livro.emprestado ? 'Sim' : 'Não'}</td>
              <td>
                {livro.emprestado
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
    </div>
  );
}

export default TabelaLivros;