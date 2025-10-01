import React, { useState } from 'react';
import { Card, Tag, Avatar, Button, Modal, Form, Input, Select, DatePicker, Space, Tooltip, Typography } from 'antd';
import { 
  PlusOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  FlagOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  dueDate: string;
  tags: string[];
  status: 'todo' | 'doing' | 'review' | 'done';
}

interface Column {
  id: string;
  title: string;
  status: Task['status'];
  color: string;
  icon: string;
}

const priorityColors = {
  baixa: '#52c41a',
  media: '#faad14', 
  alta: '#fa8c16',
  urgente: '#f5222d'
};

const columns: Column[] = [
  { id: '1', title: 'A Fazer', status: 'todo', color: '#f0f0f0', icon: '📋' },
  { id: '2', title: 'Em Andamento', status: 'doing', color: '#e6f7ff', icon: '⚡' },
  { id: '3', title: 'Em Revisão', status: 'review', color: '#fff7e6', icon: '👀' },
  { id: '4', title: 'Concluído', status: 'done', color: '#f6ffed', icon: '✅' }
];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Implementar Login',
    description: 'Criar tela de login com validação de usuário e senha',
    assignee: 'Enzo Xavier',
    priority: 'alta',
    dueDate: '2025-10-05',
    tags: ['Frontend', 'React'],
    status: 'todo'
  },
  {
    id: '2', 
    title: 'Configurar API',
    description: 'Setup inicial da API REST com Node.js',
    assignee: 'Enzo Xavier',
    priority: 'urgente',
    dueDate: '2025-10-02',
    tags: ['Backend', 'Node.js'],
    status: 'doing'
  },
  {
    id: '3',
    title: 'Design System',
    description: 'Criar componentes reutilizáveis para o sistema',
    assignee: 'Enzo Xavier',
    priority: 'media',
    dueDate: '2025-10-10',
    tags: ['Design', 'UI/UX'],
    status: 'review'
  },
  {
    id: '4',
    title: 'Documentação',
    description: 'Escrever documentação técnica do projeto',
    assignee: 'Enzo Xavier',
    priority: 'baixa',
    dueDate: '2025-09-28',
    tags: ['Docs'],
    status: 'done'
  }
];

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      form.setFieldsValue({
        ...task,
        dueDate: dayjs(task.dueDate)
      });
    } else {
      setEditingTask(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleSave = (values: any) => {
    const taskData = {
      ...values,
      dueDate: values.dueDate.format('YYYY-MM-DD'),
      tags: values.tags || []
    };

    if (editingTask) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === editingTask.id ? { ...task, ...taskData } : task
        )
      );
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskData,
        status: 'todo'
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const isOverdue = dayjs(task.dueDate).isBefore(dayjs(), 'day');
    
    return (
      <Card
        size="small"
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        style={{
          marginBottom: 8,
          cursor: 'move',
          border: `2px solid ${priorityColors[task.priority]}`,
          borderRadius: 8
        }}
        bodyStyle={{ padding: 12 }}
        actions={[
          <Tooltip title="Editar">
            <EditOutlined onClick={() => openModal(task)} />
          </Tooltip>,
          <Tooltip title="Excluir">
            <DeleteOutlined onClick={() => deleteTask(task.id)} />
          </Tooltip>
        ]}
      >
        <div style={{ marginBottom: 8 }}>
          <Text strong style={{ fontSize: 14 }}>{task.title}</Text>
          <Tag 
            color={priorityColors[task.priority]} 
            style={{ float: 'right', margin: 0, fontSize: '11px' }}
          >
            <FlagOutlined /> {task.priority.toUpperCase()}
          </Tag>
        </div>
        
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
          {task.description}
        </Text>
        
        <div style={{ marginBottom: 8 }}>
          {task.tags.map(tag => (
            <Tag key={tag} style={{ marginBottom: 4, fontSize: '11px' }}>
              {tag}
            </Tag>
          ))}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size="small" icon={<UserOutlined />} />
            <Text style={{ marginLeft: 4, fontSize: 11 }}>{task.assignee}</Text>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ClockCircleOutlined style={{ color: isOverdue ? '#f5222d' : '#666', fontSize: 12 }} />
            <Text 
              style={{ 
                marginLeft: 4, 
                fontSize: 11,
                color: isOverdue ? '#f5222d' : '#666'
              }}
            >
              {dayjs(task.dueDate).format('DD/MM')}
            </Text>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div style={{ padding: 20, height: 'calc(100vh - 200px)', overflow: 'auto' }}>
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>📋 Kanban Board</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => openModal()}
        >
          Nova Tarefa
        </Button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: 16,
        height: 'calc(100% - 60px)'
      }}>
        {columns.map(column => (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.status)}
            style={{
              backgroundColor: column.color,
              borderRadius: 8,
              padding: 16,
              minHeight: 400,
              border: '2px dashed #d9d9d9'
            }}
          >
            <div style={{ 
              marginBottom: 16, 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Text strong style={{ fontSize: 16 }}>
                {column.icon} {column.title}
              </Text>
              <Tag color="blue">
                {tasks.filter(task => task.status === column.status).length}
              </Tag>
            </div>
            
            <div>
              {tasks
                .filter(task => task.status === column.status)
                .map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={editingTask ? "Editar Tarefa" : "Nova Tarefa"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="title"
            label="Título"
            rules={[{ required: true, message: 'Digite o título da tarefa' }]}
          >
            <Input placeholder="Digite o título da tarefa" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descrição"
            rules={[{ required: true, message: 'Digite a descrição' }]}
          >
            <TextArea rows={3} placeholder="Descreva a tarefa detalhadamente" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="assignee"
              label="Responsável"
              rules={[{ required: true, message: 'Selecione o responsável' }]}
            >
              <Select placeholder="Selecione o responsável">
                <Select.Option value="João Silva">João Silva</Select.Option>
                <Select.Option value="Maria Santos">Maria Santos</Select.Option>
                <Select.Option value="Pedro Costa">Pedro Costa</Select.Option>
                <Select.Option value="Ana Oliveira">Ana Oliveira</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="priority"
              label="Prioridade"
              rules={[{ required: true, message: 'Selecione a prioridade' }]}
            >
              <Select placeholder="Selecione a prioridade">
                <Select.Option value="baixa">🟢 Baixa</Select.Option>
                <Select.Option value="media">🟡 Média</Select.Option>
                <Select.Option value="alta">🟠 Alta</Select.Option>
                <Select.Option value="urgente">🔴 Urgente</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="dueDate"
              label="Data de Entrega"
              rules={[{ required: true, message: 'Selecione a data' }]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                placeholder="Selecione a data"
              />
            </Form.Item>

            <Form.Item
              name="tags"
              label="Tags"
            >
              <Select
                mode="tags"
                placeholder="Adicione tags"
                style={{ width: '100%' }}
              >
                <Select.Option value="Frontend">Frontend</Select.Option>
                <Select.Option value="Backend">Backend</Select.Option>
                <Select.Option value="Design">Design</Select.Option>
                <Select.Option value="API">API</Select.Option>
                <Select.Option value="Database">Database</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default KanbanBoard;
