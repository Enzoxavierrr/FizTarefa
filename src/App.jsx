import React, { useState } from 'react';
import Header from './components/Header';
import Colors from './constants/Colors';

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');

  const adicionar = () => {
    if (!novaTarefa.trim()) return;
    const tarefa = { id: Date.now(), texto: novaTarefa, feita: false };
    setTarefas([...tarefas, tarefa]);
    setNovaTarefa('');
  };

  const alternar = (id) => {
    setTarefas(tarefas.map(t =>
      t.id === id ? { ...t, feita: !t.feita } : t
    ));
  };

  const remover = (id) => {
    setTarefas(tarefas.filter(t => t.id !== id));
  };

  return (
    <div style={styles.container}>
      <Header />

      <div style={styles.inputGroup}>
        <input
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
          placeholder="Nova tarefa"
          style={styles.input}
        />
        <button onClick={adicionar} style={styles.addButton}>
          Adicionar
        </button>
      </div>

      <ul style={styles.taskList}>
        {tarefas.map(t => (
          <li key={t.id} style={styles.taskItem}>
            <input
              type="checkbox"
              checked={t.feita}
              onChange={() => alternar(t.id)}
            />
            <span style={{
              ...styles.taskText,
              ...(t.feita ? styles.taskTextDone : {})
            }}>
              {t.texto}
            </span>
            <button onClick={() => remover(t.id)} style={styles.removeButton}>
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    maxWidth: 600,
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  },
  inputGroup: {
    display: 'flex',
    gap: 8,
    marginBottom: 20
  },
  input: {
    fontSize: 16,
    flex: 1,
    padding: 8,
    borderRadius: 30,
    border: '1px solid #ccc'
  },
  addButton: {
    padding: '8px 16px',
    borderRadius: 4,
    background: Colors.orange.orangeStandard,
    color: 'white',
    border: 'none',
    cursor: 'pointer'
  },
  taskList: {
    padding: 0,
    listStyle: 'none'
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8
  },
  taskText: {
    marginLeft: 10
  },
  taskTextDone: {
    textDecoration: 'line-through',
    color: '#999'
  },
  removeButton: {
    marginLeft: 'auto',
    background: 'transparent',
    color: '#f44336',
    border: 'none',
    cursor: 'pointer'
  }
};