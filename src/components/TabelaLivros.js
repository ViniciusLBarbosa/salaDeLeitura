import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import './styles2.css';

function TabelaLivros() {
  const [livros, setLivros] = useState([]);

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

  return (
    <table>
      <thead>
        <tr>
          <th>Título</th>
          <th>Autor</th>
          <th>Numero Tombo</th>
          <th>Emprestado</th>
        </tr>
      </thead>
      <tbody>
        {livros.map((livro) => (
          <tr key={livro.id}>
            <td>{livro.titulo}</td>
            <td>{livro.autor}</td>
            <td>{livro.numeroTombo}</td>
            <td>{livro.emprestado ? 'Sim' : 'Não'}</td> 
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TabelaLivros;
