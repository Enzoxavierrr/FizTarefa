import React, { useState } from 'react';

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
    <div style={{ padding: 20 }}>
      <h1>Minha Lista de Tarefas</h1>
      <input
        value={novaTarefa}
        onChange={(e) => setNovaTarefa(e.target.value)}
        placeholder="Nova tarefa"
      />
      <button onClick={adicionar}>Adicionar</button>

      <ul style={{ padding: 0, listStyle: 'none' }}>
        {tarefas.map(t => (
          <li key={t.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <input type="checkbox" checked={t.feita} onChange={() => alternar(t.id)} />
            <span style={{
              marginLeft: 10,
              textDecoration: t.feita ? 'line-through' : 'none'
            }}>
              {t.texto}
            </span>
            <button onClick={() => remover(t.id)} style={{ marginLeft: 'auto' }}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}