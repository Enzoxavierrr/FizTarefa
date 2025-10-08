import React, {
  Dispatch,
  SetStateAction,
  useState,
  DragEvent,
  FormEvent,
} from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import { Card, Typography, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Cores do projeto baseadas no Ant Design
const projectColors = {
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
  purple: '#722ed1',
  cyan: '#13c2c2',
  background: '#f5f5f5',
  cardBg: '#ffffff',
  border: '#d9d9d9',
  text: '#262626',
  textSecondary: '#8c8c8c'
};

const columnStyles = {
  backlog: {
    backgroundColor: '#f9f9f9',
    borderColor: projectColors.textSecondary,
    headerColor: projectColors.textSecondary
  },
  todo: {
    backgroundColor: '#fff7e6',
    borderColor: projectColors.warning,
    headerColor: projectColors.warning
  },
  doing: {
    backgroundColor: '#e6f7ff',
    borderColor: projectColors.primary,
    headerColor: projectColors.primary
  },
  done: {
    backgroundColor: '#f6ffed',
    borderColor: projectColors.success,
    headerColor: projectColors.success
  }
};

export const ProjectKanban = () => {
  return (
    <div style={{
      height: 'calc(100vh - 300px)',
      width: '100%',
      backgroundColor: projectColors.background,
      padding: '20px',
      borderRadius: '8px'
    }}>
      <Board />
    </div>
  );
};

const Board = () => {
  const [cards, setCards] = useState(DEFAULT_CARDS);

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      width: '100%',
      gap: '16px',
      overflowX: 'auto',
      padding: '0 8px'
    }}>
      <Column
        title="📋 Backlog"
        column="backlog"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="📝 A Fazer"
        column="todo"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="⚡ Em Progresso"
        column="doing"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="✅ Concluído"
        column="done"
        cards={cards}
        setCards={setCards}
      />
      <BurnBarrel setCards={setCards} />
    </div>
  );
};

type ColumnProps = {
  title: string;
  cards: CardType[];
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

const Column = ({
  title,
  cards,
  column,
  setCards,
}: ColumnProps) => {
  const [active, setActive] = useState(false);
  const columnStyle = columnStyles[column];

  const handleDragStart = (e: DragEvent, card: CardType) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(
        `[data-column="${column}"]`
      ) as unknown as HTMLElement[]
    );
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div style={{
      width: '280px',
      flexShrink: 0,
      height: '100%'
    }}>
      <Card
        size="small"
        style={{
          height: '100%',
          backgroundColor: columnStyle.backgroundColor,
          border: `2px solid ${active ? columnStyle.borderColor : projectColors.border}`,
          borderRadius: '12px',
          transition: 'all 0.3s ease'
        }}
        bodyStyle={{ padding: '12px' }}
        title={
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Text strong style={{ 
              color: columnStyle.headerColor,
              fontSize: '16px'
            }}>
              {title}
            </Text>
            <div style={{
              backgroundColor: columnStyle.headerColor,
              color: 'white',
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {filteredCards.length}
            </div>
          </div>
        }
      >
        <div
          onDrop={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            height: 'calc(100% - 40px)',
            minHeight: '400px',
            position: 'relative'
          }}
        >
          {filteredCards.map((c) => {
            return <TaskCard key={c.id} {...c} handleDragStart={handleDragStart} />;
          })}
          <DropIndicator beforeId={null} column={column} />
          <AddCard column={column} setCards={setCards} />
        </div>
      </Card>
    </div>
  );
};

type CardProps = CardType & {
  handleDragStart: Function;
};

const TaskCard = ({ title, id, column, handleDragStart }: CardProps) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        style={{
          cursor: 'grab',
          marginBottom: '8px',
          border: `1px solid ${projectColors.border}`,
          borderRadius: '8px',
          backgroundColor: projectColors.cardBg,
          padding: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease'
        }}
        whileHover={{
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          scale: 1.02
        }}
        whileDrag={{
          scale: 1.05,
          rotate: 5,
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
        }}
      >
        <Text style={{ 
          fontSize: '14px',
          color: projectColors.text,
          fontWeight: '500'
        }}>
          {title}
        </Text>
      </motion.div>
    </>
  );
};

type DropIndicatorProps = {
  beforeId: string | null;
  column: string;
};

const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      style={{
        height: '2px',
        width: '100%',
        backgroundColor: projectColors.primary,
        opacity: 0,
        margin: '2px 0',
        borderRadius: '1px',
        transition: 'opacity 0.2s ease'
      }}
    />
  );
};

const BurnBarrel = ({
  setCards,
}: {
  setCards: Dispatch<SetStateAction<CardType[]>>;
}) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");
    setCards((pv) => pv.filter((c) => c.id !== cardId));
    setActive(false);
  };

  return (
    <Card
      style={{
        width: '200px',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        backgroundColor: active ? '#fff2f0' : '#fafafa',
        border: `2px dashed ${active ? projectColors.error : projectColors.border}`,
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginTop: '20px'
      }}
      bodyStyle={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        height: '100%'
      }}
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div style={{
        textAlign: 'center',
        color: active ? projectColors.error : projectColors.textSecondary
      }}>
        {active ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <FaFire size={32} />
          </motion.div>
        ) : (
          <FiTrash size={32} />
        )}
        <div style={{ marginTop: '8px', fontSize: '12px' }}>
          {active ? 'Solte para excluir' : 'Zona de exclusão'}
        </div>
      </div>
    </Card>
  );
};

type AddCardProps = {
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

const AddCard = ({ column, setCards }: AddCardProps) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
    };

    setCards((pv) => [...pv, newCard]);
    setAdding(false);
    setText("");
  };

  return (
    <>
      {adding ? (
        <motion.form 
          layout 
          onSubmit={handleSubmit}
          style={{ marginTop: '8px' }}
        >
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Digite sua nova tarefa..."
            style={{
              width: '100%',
              borderRadius: '6px',
              border: `1px solid ${projectColors.primary}`,
              backgroundColor: 'rgba(24, 144, 255, 0.1)',
              padding: '12px',
              fontSize: '14px',
              color: projectColors.text,
              resize: 'vertical',
              minHeight: '80px',
              outline: 'none'
            }}
            value={text}
          />
          <Space style={{ marginTop: '8px', width: '100%', justifyContent: 'flex-end' }}>
            <Button
              size="small"
              onClick={() => {
                setAdding(false);
                setText("");
              }}
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              size="small"
              htmlType="submit"
              icon={<PlusOutlined />}
            >
              Adicionar
            </Button>
          </Space>
        </motion.form>
      ) : (
        <motion.div layout>
          <Button
            type="dashed"
            block
            onClick={() => setAdding(true)}
            icon={<PlusOutlined />}
            style={{
              marginTop: '8px',
              borderColor: projectColors.primary,
              color: projectColors.primary,
              height: '40px'
            }}
          >
            Adicionar tarefa
          </Button>
        </motion.div>
      )}
    </>
  );
};

type ColumnType = "backlog" | "todo" | "doing" | "done";

type CardType = {
  title: string;
  id: string;
  column: ColumnType;
};

const DEFAULT_CARDS: CardType[] = [
  // BACKLOG
  { title: "Implementar sistema de notificações", id: "1", column: "backlog" },
  { title: "Configurar pipeline de CI/CD", id: "2", column: "backlog" },
  { title: "Migração para microserviços", id: "3", column: "backlog" },
  { title: "Documentar APIs do sistema", id: "4", column: "backlog" },
  
  // TODO
  { title: "Pesquisar opções de banco NoSQL", id: "5", column: "todo" },
  { title: "Revisar código do módulo de pagamento", id: "6", column: "todo" },
  { title: "Sync com equipe sobre roadmap Q4", id: "7", column: "todo" },

  // DOING
  { title: "Refatorar componentes de autenticação", id: "8", column: "doing" },
  { title: "Implementar logs detalhados", id: "9", column: "doing" },
  
  // DONE
  { title: "Configurar monitoring em produção", id: "10", column: "done" },
  { title: "Implementar testes automatizados", id: "11", column: "done" },
];

const KanbanBoard: React.FC = () => {
  return <ProjectKanban />;
};

export default KanbanBoard;