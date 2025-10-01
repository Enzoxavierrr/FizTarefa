import React from 'react';
import type { BadgeProps, CalendarProps } from 'antd';
import { Badge, Calendar, ConfigProvider } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import ptBR from 'antd/locale/pt_BR';

dayjs.locale('pt-br');

interface TaskEvent {
  type: 'warning' | 'success' | 'error';
  content: string;
}

const getListData = (value: Dayjs): TaskEvent[] => {
  let listData: TaskEvent[] = [];
  
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'warning', content: 'Reunião de planejamento às 14h' },
        { type: 'success', content: 'Entrega do relatório' },
      ];
      break;
    case 10:
      listData = [
        { type: 'warning', content: 'Deadline importante!' },
        { type: 'success', content: 'Apresentação do projeto' },
        { type: 'error', content: 'Revisão urgente necessária' },
      ];
      break;
    case 15:
      listData = [
        { type: 'warning', content: 'Reunião com cliente' },
        { type: 'success', content: 'Finalização da sprint atual' },
        { type: 'error', content: 'Bug crítico reportado' },
        { type: 'error', content: 'Servidor de produção instável' },
        { type: 'error', content: 'Backup falhou' },
        { type: 'error', content: 'Falha na integração' },
      ];
      break;
    case 30: 
      listData = [
        { type: 'success', content: 'Review de código' },
        { type: 'warning', content: 'Deploy programado para 18h' },
      ];
      break;
    default:
      break;
  }
  return listData;
};

const getMonthData = (value: Dayjs): number | undefined => {
  if (value.month() === 8) {
    return 1394; 
  }
  return undefined;
};

const CalendarComponent: React.FC = () => {
  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month" style={{ 
        textAlign: 'center', 
        fontSize: '12px',
        color: '#666'
      }}>
        <section style={{ fontWeight: 'bold' }}>{num}</section>
        <span>Tarefas no mês</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events" style={{ 
        listStyle: 'none', 
        padding: 0, 
        margin: 0,
        fontSize: '11px'
      }}>
        {listData.map((item, index) => (
          <li key={`${item.content}-${index}`} style={{ marginBottom: '2px' }}>
            <Badge 
              status={item.type as BadgeProps['status']} 
              text={item.content}
              style={{ fontSize: '11px' }}
            />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  return (
    <ConfigProvider locale={ptBR}>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
        <Calendar 
          cellRender={cellRender}
          style={{ border: '1px solid #f0f0f0', borderRadius: '6px' }}
        />
      </div>
    </ConfigProvider>
  );
};

export default CalendarComponent;