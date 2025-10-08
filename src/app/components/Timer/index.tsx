import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Select, Typography, Progress, Space, Statistic, Modal, Input, List, Tag, Divider } from 'antd';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  ReloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  StopOutlined,
  BellOutlined,
  HistoryOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface TimerSession {
  id: string;
  task: string;
  duration: number;
  completedAt: Date;
  type: 'pomodoro' | 'short-break' | 'long-break' | 'custom';
}

interface TimerPreset {
  name: string;
  minutes: number;
  type: 'pomodoro' | 'short-break' | 'long-break' | 'custom';
  color: string;
}

const timerPresets: TimerPreset[] = [
  { name: 'Pomodoro (25 min)', minutes: 25, type: 'pomodoro', color: '#f5222d' },
  { name: 'Pausa Curta (5 min)', minutes: 5, type: 'short-break', color: '#52c41a' },
  { name: 'Pausa Longa (15 min)', minutes: 15, type: 'long-break', color: '#1890ff' },
  { name: 'Foco Profundo (45 min)', minutes: 45, type: 'custom', color: '#722ed1' },
  { name: 'Reunião (30 min)', minutes: 30, type: 'custom', color: '#fa8c16' },
  { name: 'Custom', minutes: 0, type: 'custom', color: '#13c2c2' }
];

const Timer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos em segundos
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(timerPresets[0]);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [currentTask, setCurrentTask] = useState('');
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalTimeToday, setTotalTimeToday] = useState(0);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const originalTime = useRef(timeLeft);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Formatar tempo em MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad2(mins)}:${pad2(secs)}`;
  };

  // Calcular porcentagem do progresso
  const getProgress = (): number => {
    return ((originalTime.current - timeLeft) / originalTime.current) * 100;
  };

  // Iniciar/Pausar timer
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Resetar timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(originalTime.current);
  };

  // Parar timer completamente
  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(originalTime.current);
    setCurrentTask('');
  };

  // Completar timer
  const handleTimerComplete = () => {
    // Tocar som de notificação (simulado)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Timer Concluído!', {
        body: `${selectedPreset.name} finalizado${currentTask ? ` - ${currentTask}` : ''}`,
        icon: '/favicon.ico'
      });
    }

    // Adicionar sessão ao histórico
    const newSession: TimerSession = {
      id: Date.now().toString(),
      task: currentTask || `${selectedPreset.name}`,
      duration: originalTime.current / 60,
      completedAt: new Date(),
      type: selectedPreset.type
    };

    setSessions(prev => [newSession, ...prev.slice(0, 9)]); // Manter apenas 10 sessões
    setTotalTimeToday(prev => prev + (originalTime.current / 60));
    
    // Modal de conclusão
    Modal.success({
      title: '🎉 Timer Concluído!',
      content: `Parabéns! Você completou ${selectedPreset.name}${currentTask ? ` trabalhando em: ${currentTask}` : ''}`,
      okText: 'Continuar'
    });
  };

  // Alterar preset do timer
  const handlePresetChange = (value: string) => {
    const preset = timerPresets.find(p => p.name === value);
    if (preset) {
      setSelectedPreset(preset);
      if (preset.name === 'Custom') {
        setIsModalVisible(true);
      } else {
        const newTime = preset.minutes * 60;
        setTimeLeft(newTime);
        originalTime.current = newTime;
        setIsRunning(false);
      }
    }
  };

  // Configurar timer customizado
  const handleCustomTimer = () => {
    const newTime = customMinutes * 60;
    setTimeLeft(newTime);
    originalTime.current = newTime;
    setIsRunning(false);
    setIsModalVisible(false);
  };

  // Solicitar permissão para notificações
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <Title level={2}>⏱️ Timer Pomodoro</Title>
        <Text type="secondary">Gerencie seu tempo e aumente sua produtividade</Text>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Timer Principal */}
        <Card 
          title="Timer" 
          style={{ textAlign: 'center' }}
          extra={
            <Select 
              value={selectedPreset.name} 
              onChange={handlePresetChange}
              style={{ width: 200 }}
            >
              {timerPresets.map(preset => (
                <Option key={preset.name} value={preset.name}>
                  {preset.name}
                </Option>
              ))}
            </Select>
          }
        >
          <div style={{ marginBottom: '24px' }}>
            <Progress
              type="circle"
              percent={getProgress()}
              size={200}
              strokeColor={selectedPreset.color}
              format={() => (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: selectedPreset.color }}>
                    {formatTime(timeLeft)}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {selectedPreset.name}
                  </div>
                </div>
              )}
            />
          </div>

          <Space size="large">
            <Button
              type="primary"
              size="large"
              icon={isRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={toggleTimer}
              style={{ backgroundColor: selectedPreset.color, borderColor: selectedPreset.color }}
            >
              {isRunning ? 'Pausar' : 'Iniciar'}
            </Button>
            
            <Button
              size="large"
              icon={<ReloadOutlined />}
              onClick={resetTimer}
            >
              Resetar
            </Button>
            
            <Button
              size="large"
              icon={<StopOutlined />}
              onClick={stopTimer}
              danger
            >
              Parar
            </Button>
          </Space>

          <div style={{ marginTop: '24px' }}>
            <Input
              placeholder="Em que você está trabalhando? (opcional)"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              prefix={<ClockCircleOutlined />}
              size="large"
            />
          </div>
        </Card>

        {/* Estatísticas */}
        <Card title="📊 Estatísticas de Hoje">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Statistic
              title="Tempo Total Focado"
              value={totalTimeToday}
              suffix="min"
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ClockCircleOutlined />}
            />
            
            <Statistic
              title="Sessões Completadas"
              value={sessions.length}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />

            <Divider />

            <Title level={5}>⚡ Presets Rápidos</Title>
            <Space wrap>
              {timerPresets.slice(0, 4).map(preset => (
                <Button
                  key={preset.name}
                  size="small"
                  style={{ borderColor: preset.color, color: preset.color }}
                  onClick={() => handlePresetChange(preset.name)}
                >
                  {preset.minutes}min
                </Button>
              ))}
            </Space>
          </Space>
        </Card>
      </div>

      {/* Histórico de Sessões */}
      <Card 
        title={
          <span>
            <HistoryOutlined style={{ marginRight: '8px' }} />
            Histórico de Sessões
          </span>
        }
      >
        {sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <ClockCircleOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
            <div style={{ marginTop: '16px' }}>
              <Text type="secondary">Nenhuma sessão completada ainda</Text>
            </div>
          </div>
        ) : (
          <List
            dataSource={sessions}
            renderItem={(session) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      backgroundColor: timerPresets.find(p => p.type === session.type)?.color || '#1890ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {session.duration}m
                    </div>
                  }
                  title={session.task}
                  description={
                    <Space>
                      <Text type="secondary">
                        {session.completedAt.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Text>
                      <Tag color={timerPresets.find(p => p.type === session.type)?.color}>
                        {session.type === 'pomodoro' ? 'Pomodoro' : 
                         session.type === 'short-break' ? 'Pausa Curta' :
                         session.type === 'long-break' ? 'Pausa Longa' : 'Personalizado'}
                      </Tag>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Modal para Timer Customizado */}
      <Modal
        title="⚙️ Configurar Timer Personalizado"
        open={isModalVisible}
        onOk={handleCustomTimer}
        onCancel={() => setIsModalVisible(false)}
        okText="Aplicar"
        cancelText="Cancelar"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>Defina a duração em minutos:</Text>
          <Input
            type="number"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(Number(e.target.value))}
            min={1}
            max={120}
            suffix="minutos"
            size="large"
          />
          <Text type="secondary">Mínimo: 1 minuto, Máximo: 120 minutos</Text>
        </Space>
      </Modal>
    </div>
  );
};

export default Timer;
