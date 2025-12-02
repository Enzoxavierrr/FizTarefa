-- Migração para adicionar campo scheduled_time na tabela tasks
-- Execute este SQL no Supabase SQL Editor

-- Adicionar coluna scheduled_time (hora agendada do dia, ex: 9 para 09:00)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS scheduled_time int;

-- Comentário explicativo
COMMENT ON COLUMN tasks.scheduled_time IS 'Hora do dia em que a tarefa está agendada (0-23). NULL se não agendada.';

