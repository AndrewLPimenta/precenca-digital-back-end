import jwt from 'jsonwebtoken';
import { supabase } from '../supabaseClient.js'; // Supabase Client já configurado

const JWT_SECRET_KEY = 'sua_chave_secreta'; // Isso pode ser uma chave secreta genérica ou única para cada aluno!

// Função para criar JWT único para o aluno após o login
export const loginAluno = async (req, res) => {
  try {
    // Simulação de login via UniFOA
    // Aqui você receberia um token do UniFOA que está validando o aluno.
    const { email } = req.body;  // Supondo que você tenha o email do aluno

    // Verificar se o aluno existe no banco de dados
    const { data: aluno, error } = await supabase
      .from('alunos')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !aluno) {
      return res.status(400).json({ message: 'Aluno não encontrado no sistema.' });
    }

    // Criar um JWT para o aluno
    const alunoId = aluno.id;  // Aqui você usaria o ID do aluno
    const payload = { alunoId, email: aluno.email };  // Dados necessários para o JWT

    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });

    // Retornar o token gerado para o cliente
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao fazer login.' });
  }
};

// Middleware para verificar se o aluno está autenticado
export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.aluno = decoded;
    next();  // Se o token for válido, continua para a próxima função
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
};
