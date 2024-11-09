import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles.css';


function CadastroAluno() {
  const [aluno, setAluno] = useState('');
  const [sala, setSala] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await addDoc(collection(db, 'alunos'), {
        nome: aluno,
        serie: sala,
      });

      setAluno('');
      setSala('');

      alert('Auno cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar Aluno:', error);
      alert('Erro ao cadastrar Aluno.');
    }
  };

  

  return (
    
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="aluno">Auno:</label>
        <input
          type="text"
          id="aluno"
          value={aluno}
          onChange={(e) => setAluno(e.target.value)}
          required
        />
        <label htmlFor="sala">Ano/Serie:</label>
        <input
          type="text"
          id="sala"
          value={sala}
          onChange={(e) => setSala(e.target.value)}
          required
        />
      </div>
      
      <button type="submit">Cadastrar</button>
    </form>
  );
}

export default CadastroAluno;
