import React, { useState } from 'react';
import { doc, updateDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase'; 

function EmprestimoLivro() {
  const [nomeDoAluno, setNomeDoAluno] = useState('');
  const [nomeDoLivro, setNomeDoLivro] = useState('');
  const [numeroTombo, setNumeroTombo] = useState('');

  const buscarLivroIdPorNome = async (nomeDoLivro) => {
    if (!nomeDoLivro) {
      return null;
    }

    try {
      const livrosCollection = collection(db, 'livros');
      const q = query(livrosCollection, where("titulo", "==", nomeDoLivro));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length > 0) {
        return querySnapshot.docs[0].id;
      } else {
        return null; 
      }
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      return null;
    }
  };

  const buscarLivroIdPorNumero = async (numeroTombo) => {
    if (!numeroTombo) {
      return null;
    }

    try {
      const livrosCollection = collection(db, 'livros');
      const q = query(livrosCollection, where("numeroTombo", "==", numeroTombo));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length >= 0) {
        return querySnapshot.docs[0].id;
      } else {
        return null; 
      }
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      return null;
    }
  };

  const registrarEmprestimo = async (livroId, nomeDoAluno) => {
    try {
      const emprestimosCollection = collection(db, 'emprestimos');
      await addDoc(emprestimosCollection, {
        livroId: livroId,
        livroIdNumero: numeroTombo,
        aluno: nomeDoAluno,
        dataEmprestimo: new Date() 
      });
      const livroRef = doc(db, 'livros', livroId);
      await updateDoc(livroRef, { 
        alunoEmprestado: nomeDoAluno 
      });
    } catch (error) {
      console.error('Erro ao registrar empréstimo:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const livroIdNome = await buscarLivroIdPorNome(nomeDoLivro);
      const livroIdNumero = await buscarLivroIdPorNumero(numeroTombo);

      let livroId = null;
      if (livroIdNome && livroIdNumero) {
        if (livroIdNome === livroIdNumero) {
          livroId = livroIdNome;
        } else {
          alert('O título do livro e seu numero tombo não conferem.');
          return;
        }
      } else if (livroIdNome) {
        livroId = livroIdNome;
      } else if (livroIdNumero) {
        livroId = livroIdNumero;
      } else {
        alert('Livro não encontrado.');
        return;
      }

      const livroRef = doc(db, 'livros', livroId);
      await updateDoc(livroRef, {
        emprestado: true,
        alunoEmprestado: nomeDoAluno,
      });

      await registrarEmprestimo(livroId, nomeDoAluno);

      setNomeDoAluno('');
      setNomeDoLivro('');
      setNumeroTombo('');

      alert('Livro emprestado com sucesso.');
    } catch (error) {
      console.error('Erro ao emprestar livro:', error);
      alert('Erro ao emprestar livro.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nomeDoAluno">Aluno:</label>
        <input
          type="text"
          id="nomeDoAluno"
          value={nomeDoAluno}
          onChange={(e) => setNomeDoAluno(e.target.value)}
          required
        />
        <label htmlFor="nomeDoLivro">Livro:</label>
        <input
          type="text"
          id="nomeDoLivro"
          value={nomeDoLivro}
          onChange={(e) => setNomeDoLivro(e.target.value)}
        />
        <label htmlFor="numeroTombo">Numero tombo:</label>
        <input
          type="text"
          id="NumeroTombo"
          value={numeroTombo}
          onChange={(e) => setNumeroTombo(e.target.value)}
        />
      </div>
      <button type="submit">Emprestar</button>
    </form>
  );
}

export default EmprestimoLivro;
