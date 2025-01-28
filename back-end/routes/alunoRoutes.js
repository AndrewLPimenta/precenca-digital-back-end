import express from 'express';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabaseClient.js';

const router = express.Router();

// Middleware para verificar se o token JWT é válido
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Token do cabeçalho Authorization

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }

    req.user = decoded;
    next();
  });
};

// Rota para registrar o aluno
router.post('/register', verificarToken, async (req, res) => {
  const { nome, matricula } = req.body;

  if (!nome || !matricula) {
    return res.status(400).json({
      success: false,
      message: 'Nome e matrícula são obrigatórios',
    });
  }

  try {
    // Verificação de matrícula existente no banco
    const { data, error } = await supabase.from('alunos').select('*').eq('matricula', matricula);

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao verificar aluno no banco.',
        errorDetails: error.message,
      });
    }

    if (data && data.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Aluno já registrado com esta matrícula.',
      });
    }

    // Registro do aluno
    const { data: insertedData, error: insertError } = await supabase
      .from('alunos')
      .insert([{ nome, matricula }]);

    if (insertError) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao registrar aluno.',
        errorDetails: insertError.message,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Aluno registrado com sucesso!',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar aluno.',
      errorDetails: err.message,
    });
  }
});

export default router;
