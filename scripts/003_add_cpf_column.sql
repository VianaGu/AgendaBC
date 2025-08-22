-- Adicionando coluna CPF na tabela clientes com constraint de unicidade
ALTER TABLE clientes ADD COLUMN cpf VARCHAR(14) UNIQUE;
