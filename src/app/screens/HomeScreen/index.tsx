import React, { useState } from 'react';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
  CalendarOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Button, Card, Row, Col, Statistic, Typography, Space } from 'antd';
import CalendarComponent from '../../components/Calendar';
import KanbanBoard from '../../components/KanBam';
import Timer from '../../components/Timer';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

interface HomeScreenProps {
  user?: { name: string; email: string; id: string };
  onLogout?: () => void;
}



function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Quadro', '1', <CheckCircleOutlined />),
  getItem('Minhas Tarefas', '2', <ClockCircleOutlined />),
  getItem('Agenda', '3', <CalendarOutlined />),
  getItem('Timer', '4', <ClockCircleOutlined />),
  getItem('Grupos', '5', <TeamOutlined />),
  getItem('Perfil', 'sub1', <UserOutlined />, [
    getItem('Meus Dados', '6'),
    getItem('Preferências', '7'),
  ]),
  getItem('Configurações', '8', <SettingOutlined />),
];

const HomeScreen: React.FC<HomeScreenProps> = ({ user, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(['1']);
  const [currentView, setCurrentView] = useState('quadro');
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedKeys([e.key]);
    
    switch (e.key) {
      case '1':
        setCurrentView('quadro');
        console.log('Navegando para Quadro de Tarefas');
        break;
      case '2':
        setCurrentView('tasks');
        console.log('Navegando para Minhas Tarefas');
        break;
      case '3':
        setCurrentView('calendar');
        console.log('Navegando para Agenda');
        break;
      case '4':
        setCurrentView('timer');
        console.log('Navegando para Timer');
        break;
      case '5':
        setCurrentView('grupos');
        console.log('Navegando para Grupos');
        break;
      case '6':
        setCurrentView('profile');
        console.log('Navegando para Meus Dados');
        break;
      case '7':
        setCurrentView('preferences');
        console.log('Navegando para Preferências');
        break;
      case '8':
        setCurrentView('settings');
        console.log('Navegando para Configurações');
        break;
      default:
        break;
    }
  };

  const taskStats = [
    {
      title: 'Tarefas Pendentes',
      value: 8,
      precision: 0,
      valueStyle: { color: '#1890ff' },
      prefix: <ClockCircleOutlined />,
    },
    {
      title: 'Concluídas Hoje',
      value: 5,
      precision: 0,
      valueStyle: { color: '#52c41a' },
      prefix: <CheckCircleOutlined />,
    },
    {
      title: 'Total Mensal',
      value: 24,
      precision: 0,
      valueStyle: { color: '#722ed1' },
    },
    {
      title: 'Taxa de Conclusão',
      value: 87.5,
      precision: 1,
      suffix: '%',
      valueStyle: { color: '#faad14' },
    },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'quadro':
        return (
          <>
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              {taskStats.map((stat, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card>
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      precision={stat.precision}
                      valueStyle={stat.valueStyle}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            <div
              style={{
                padding: 0,
                minHeight: 'calc(100vh - 300px)',
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <KanbanBoard />
            </div>
          </>
        );

      case 'tasks':
        return (
          <Card title="📋 Minhas Tarefas" style={{ minHeight: '400px' }}>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <CheckCircleOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={3}>Lista de Tarefas</Title>
              <Text type="secondary">Aqui você verá todas as suas tarefas organizadas</Text>
              <br /><br />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleMenuClick({ key: '5' } as any)}>
                Criar Nova Tarefa
              </Button>
            </div>
          </Card>
        );

      case 'calendar':
        return (
          <Card title="📅 Agenda" style={{ minHeight: '400px' }}>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <CalendarComponent />
              <Text type="secondary">Visualize suas tarefas organizadas por data</Text>
            </div>
          </Card>
        );

      case 'timer':
        return <Timer />;

      case 'grupos':
        return (
          <Card title="👥 Grupos" style={{ minHeight: '400px' }}>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <TeamOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
              <Title level={3}>Gerenciamento de Grupos</Title>
              <Text type="secondary">Aqui você pode gerenciar seus grupos de trabalho</Text>
            </div>
          </Card>
        );

      case 'profile':
        return (
          <Card title="👤 Meus Dados" style={{ minHeight: '400px' }}>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <UserOutlined style={{ fontSize: '48px', color: '#faad14', marginBottom: '16px' }} />
              <Title level={3}>Perfil do Usuário</Title>
              <Text type="secondary">Nome: {user?.name || 'Usuário'}</Text>
              <br />
              <Text type="secondary">Email: {user?.email || 'email@exemplo.com'}</Text>
            </div>
          </Card>
        );

      case 'preferences':
        return (
          <Card title="⚙️ Preferências" style={{ minHeight: '400px' }}>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <SettingOutlined style={{ fontSize: '48px', color: '#13c2c2', marginBottom: '16px' }} />
              <Title level={3}>Preferências do Sistema</Title>
              <Text type="secondary">Configure suas preferências pessoais</Text>
            </div>
          </Card>
        );

      case 'settings':
        return (
          <Card title="🔧 Configurações" style={{ minHeight: '400px' }}>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <SettingOutlined style={{ fontSize: '48px', color: '#f5222d', marginBottom: '16px' }} />
              <Title level={3}>Configurações do Sistema</Title>
              <Text type="secondary">Gerencie as configurações da aplicação</Text>
            </div>
          </Card>
        );

      default:
        return <div>Tela não encontrada</div>;
    }
  };

  // Função para obter o título da página atual
  const getCurrentPageTitle = () => {
    switch (currentView) {
      case 'Quadro': return 'Quadro';
      case 'tasks': return 'Minhas Tarefas';
      case 'calendar': return 'Agenda';
      case 'timer': return 'Timer';
      case 'grupos': return 'Grupos';
      case 'profile': return 'Meus Dados';
      case 'preferences': return 'Preferências';
      case 'settings': return 'Configurações';
      default: return 'Quadro';
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '20px',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {collapsed ? '🎯' : '🎯 FizTarefa'}
        </div>
        <Menu 
          theme="dark" 
          selectedKeys={selectedKeys}
          mode="inline" 
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Title level={4} style={{ margin: 0 }}>
            Olá, {user?.name || 'Usuário'}! 👋
          </Title>
          
          <Space>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={onLogout}
              danger
            >
              {collapsed ? '' : 'Sair'}
            </Button>
          </Space>
        </Header>
        
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb 
            style={{ margin: '16px 0' }} 
            items={[
              { title: 'Home' }, 
              { title: getCurrentPageTitle() }
            ]} 
          />
          
          {renderContent()}
        </Content>
        
        <Footer style={{ textAlign: 'center' }}>
          FizTarefa ©{new Date().getFullYear()} - Gerencie suas tarefas com eficiência
        </Footer>
      </Layout>
    </Layout>
  );
};

export default HomeScreen;