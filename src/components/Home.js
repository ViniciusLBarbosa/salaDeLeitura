import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../App.css';

function Home() {
  const [livrosEmprestados, setLivrosEmprestados] = useState([]);
  const [devolucoesProximas, setDevolucoesProximas] = useState([]);

  useEffect(() => {
    const fetchLivrosEmprestados = async () => {
      try {
        const emprestimosRef = collection(db, 'emprestimos');
        const q = query(emprestimosRef);
        const querySnapshot = await getDocs(q);

        const livros = await Promise.all(querySnapshot.docs.map(async (emprestimoDoc) => {
          const emprestimoData = emprestimoDoc.data();

          // Buscar dados do livro
          const livroRef = doc(db, 'livros', emprestimoData.livroId);
          const livroDoc = await getDoc(livroRef);
          const livro = livroDoc.exists() ? livroDoc.data() : null;

          // Buscar dados do aluno
          const alunoRef = doc(db, 'alunos', emprestimoData.alunoId);
          const alunoDoc = await getDoc(alunoRef);
          const aluno = alunoDoc.exists() ? alunoDoc.data() : null;

          return {
            id: doc.id,
            ...emprestimoData,
            livro,
            aluno,
          };
        }));

        console.log("querySnapshot:", querySnapshot);
        console.log("livros:", livros);
        setLivrosEmprestados(livros);
      } catch (error) {
        console.error('Erro ao buscar livros emprestados:', error);
      }
    };

    const fetchDevolucoesProximas = async () => {
      try {
        const emprestimosRef = collection(db, 'emprestimos');
        const q = query(emprestimosRef, orderBy('dataDevolucao'), limit(5));
        const querySnapshot = await getDocs(q);
    
        const livros = await Promise.all(querySnapshot.docs.map(async (devolucaoDoc) => {
          const emprestimoData = devolucaoDoc.data();
    
          // Buscar dados do livro
          const livroRef = doc(db, 'livros', emprestimoData.livroId);
          const livroDoc = await getDoc(livroRef);
          const livro = livroDoc.exists() ? livroDoc.data() : null;
    
          // Buscar dados do aluno
          const alunoRef = doc(db, 'alunos', emprestimoData.alunoId);
          const alunoDoc = await getDoc(alunoRef);
          const aluno = alunoDoc.exists() ? alunoDoc.data() : null;
    
          return {
            id: doc.id,
            ...emprestimoData,
            livro,
            aluno,
          };
        }));
    
        setDevolucoesProximas(livros);
      } catch (error) {
        console.error('Erro ao buscar devoluções próximas:', error);
      }
    };

    fetchLivrosEmprestados();
    fetchDevolucoesProximas();
  }, []);

  const formatarData = (data) => {
    if (data) {
      const dataObj = data.toDate(); 
      const dia = dataObj.getDate();
      const mes = dataObj.getMonth() + 1; 
      const ano = dataObj.getFullYear();

      return `${dia}/${mes}/${ano} `;
    }
    return ''; 
  };

  return (
    <div className="app-container">
      <div className="main">
        <h2>Resumo</h2>


        <h3 className='titulos'>Devoluções Próximas</h3>
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Aluno</th>
              <th>Série</th>
              <th>Data de Devolução</th>
            </tr>
          </thead>
          <tbody>
            {devolucoesProximas.map((emprestimo) => (
              <tr key={emprestimo.id}>
              <td>{emprestimo.livro ? emprestimo.livro.titulo : 'Livro não encontrado'}</td> 
              <td>{emprestimo.aluno ? emprestimo.aluno.nome : 'Aluno não encontrado'}</td>
              <td>{emprestimo.aluno ? emprestimo.aluno.serie : 'Aluno não encontrado'}</td>
              <td>{formatarData(emprestimo.dataDevolucao)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className='titulos'>Livros Emprestados</h3>
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Aluno</th>
              <th>Série</th>
              <th>Data de Empréstimo</th>
            </tr>
          </thead>
          <tbody>
            {livrosEmprestados.map((emprestimo) => (
              <tr key={emprestimo.id}>
              <td>{emprestimo.livro ? emprestimo.livro.titulo : 'Livro não encontrado'}</td> 
              <td>{emprestimo.aluno ? emprestimo.aluno.nome : 'Aluno não encontrado'}</td>
              <td>{emprestimo.aluno ? emprestimo.aluno.serie : 'Aluno não encontrado'}</td>
              <td>{formatarData(emprestimo.dataEmprestimo)}</td> 
              </tr>
            ))}
          </tbody>
        </table>

        
      </div>
    </div>
  );
}

export default Home;