-- Inserir serviços padrão
INSERT INTO public.servicos (nome, preco, duracao) VALUES
('Manicure Simples', 25.00, 60),
('Pedicure Simples', 30.00, 60),
('Unha de Gel', 45.00, 90),
('Nail Art', 35.00, 75),
('Francesinha', 40.00, 80),
('Esmaltação', 15.00, 30)
ON CONFLICT DO NOTHING;

-- Inserir alguns clientes de exemplo
INSERT INTO public.clientes (nome, telefone) VALUES
('Maria Silva', '(11) 99999-1234'),
('Ana Santos', '(11) 98888-5678'),
('Carla Oliveira', '(11) 97777-9012')
ON CONFLICT DO NOTHING;

-- Inserir algumas fotos de portfólio de exemplo
INSERT INTO public.portfolio (titulo, descricao, imagem_url) VALUES
('Nail Art Floral', 'Design delicado com flores em tons pastéis', '/floral-nail-art.png'),
('Francesinha Clássica', 'Francesinha tradicional com acabamento perfeito', '/classic-french-manicure.png'),
('Unhas com Glitter', 'Design glamouroso com glitter dourado', '/glitter-nail-art-sparkly.png')
ON CONFLICT DO NOTHING;
