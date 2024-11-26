import React, { useState, useEffect } from 'react';
import { doc, updateDoc, collection, query, where, getDocs, addDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles.css';

function EmprestimoLivro() {
  const [nomeDoAluno, setNomeDoAluno] = useState('');
  const [serieDoAluno, setSerieDoAluno] = useState('');
  const [nomeDoLivro, setNomeDoLivro] = useState('');
  const [numeroTombo, setNumeroTombo] = useState('');
  const [alunos, setAlunos] = useState([]);

  const buscarAlunos = async () => {
    try {
      const alunosCollection = collection(db, 'alunos');
      const alunosSnapshot = await getDocs(alunosCollection);
      const alunosList = alunosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAlunos(alunosList);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  useEffect(() => {
    buscarAlunos();
  }, []);

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

  const registrarEmprestimo = async (livroId, alunoId) => {
    try {
      const livroRef = doc(db, 'livros', livroId);
      const livroDoc = await getDoc(livroRef);

      if (livroDoc.exists()) {
        console.log("Livro emprestado:", livroDoc.data().emprestado);
        if (livroDoc.data().emprestado) {
          alert('Este livro já está emprestado.');
          return true;
        }
        else{
          alert('Livro emprestado com sucesso.');
        }

        const dataEmprestimo = new Date();
        let dataDevolucao = new Date();
        dataDevolucao.setDate(dataEmprestimo.getDate() + 14);

        const emprestimosCollection = collection(db, 'emprestimos');
        await addDoc(emprestimosCollection, {
          livroId: livroId,
          status: 'emprestado',
          livroIdNumero: numeroTombo,
          alunoId: alunoId,
          dataEmprestimo: dataEmprestimo,
          dataDevolucao: dataDevolucao
        });

        await updateDoc(livroRef, {
          emprestado: true,
          alunoEmprestado: alunoId,
          serie: serieDoAluno
        });

        const alunoRef = doc(db, 'alunos', alunoId);
        await updateDoc(alunoRef, {
          livrosEmprestados: arrayUnion(livroId)
        });

      } else {
        console.error('Documento do livro não encontrado.');
      }
      return;
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

      const aluno = alunos.find(a => a.nome === nomeDoAluno);

      if (aluno) {
        await registrarEmprestimo(livroId, aluno.id);
      } else {
        try {
          const novoAlunoRef = await addDoc(collection(db, 'alunos'), {
            nome: nomeDoAluno,
            serie: serieDoAluno,
            livrosEmprestados: []
          });
          await registrarEmprestimo(livroId, novoAlunoRef.id);

        } catch (error) {
          console.error('Erro ao cadastrar aluno:', error);
          alert('Erro ao cadastrar aluno.');
          return;
        }
      }

      setNomeDoAluno('');
      setNomeDoLivro('');
      setNumeroTombo('');
      setSerieDoAluno('');


      buscarAlunos();
    } catch (error) {
      console.error('Erro ao emprestar livro:', error);
      alert('Erro ao emprestar livro.');
    }
  };

  const handleAlunoChange = (event) => {
    const alunoSelecionado = alunos.find(aluno => aluno.nome === event.target.value);
    if (alunoSelecionado) {
      setNomeDoAluno(alunoSelecionado.nome);
      setSerieDoAluno(alunoSelecionado.serie);
    } else {
      setNomeDoAluno(event.target.value);
      setSerieDoAluno('');
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
          onChange={handleAlunoChange}
          list="alunos-list"
          required
        />
        <datalist id="alunos-list">
          {alunos.map(aluno => (
            <option key={aluno.id} value={aluno.nome} />
          ))}
        </datalist>

        <label htmlFor="serieDoAluno">Ano/Série:</label>
        <input
          type="text"
          id="serie"
          value={serieDoAluno}
          onChange={(e) => setSerieDoAluno(e.target.value)}
          required
          readOnly
        />
        <label htmlFor="nomeDoLivro">Livro:</label>
        <input
          type="text"
          id="nomeDoLivro"
          value={nomeDoLivro}
          onChange={(e) => setNomeDoLivro(e.target.value)}
        />
        <label htmlFor="numeroTombo">Número tombo:</label>
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