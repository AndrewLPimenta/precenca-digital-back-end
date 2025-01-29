import express from 'express';
import cors from 'cors';
import supabase from './supabaseClient.js'; // Arquivo de configuração do Supabase
const app = express();

// Habilitar CORS
app.use(cors({
  origin: 'https://presenca-digital-3oy9.vercel.app/',  // Front-End
}));

// Middleware para JSON
app.use(express.json());

// Rota de fallback para a raiz
app.get('/', (req, res) => {
  res.send('Servidor está funcionando!');
});

// Rota para listar os alunos
app.get('/api/alunos', async (req, res) => {
  try {
    const { data, error } = await supabase.from('alunos').select('*');

    if (error) {
      console.error('Erro ao listar alunos:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar alunos.',
        errorDetails: error.message,
      });
    }

    res.status(200).json(data); // Retorna a lista de alunos
  } catch (err) {
    console.error('Erro inesperado ao listar alunos:', err);
    res.status(500).json({
      success: false,
      message: 'Erro inesperado ao listar alunos.',
      errorDetails: err.message,
    });
  }
});

// Rota POST para registrar alunos
app.post('/api/register', async (req, res) => {
  const { nome, matricula } = req.body;

  // Verificar se o nome e a matrícula foram informados
  if (!nome || !matricula) {
    return res.status(400).json({
      success: false,
      message: 'Nome completo e matrícula são obrigatórios para registro!',
    });
  }

  // Verificar se a matrícula tem exatamente 9 caracteres
  if (matricula.length !== 9) {
    return res.status(400).json({
      success: false,
      message: 'A matrícula deve ter exatamente 9 caracteres.',
    });
  }

  try {
    // Verificar se o aluno já existe (nome ou matrícula)
    const { data: existingStudent, error } = await supabase
      .from('alunos')
      .select('matricula, nome')
      .eq('matricula', matricula)
      .or(`nome.eq.${nome}`)
      .limit(1);

    if (error) {
      console.error('Erro ao verificar aluno no banco de dados:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao verificar aluno no banco de dados.',
        errorDetails: error.message,
      });
    }

    if (existingStudent && existingStudent.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Aluno já registrado com este nome ou matrícula.',
      });
    }

    // Registrar o aluno no banco de dados
    const { data, error: insertError } = await supabase
      .from('alunos')
      .insert([{ nome, matricula }]);

    if (insertError) {
      console.error('Erro ao registrar aluno:', insertError);
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
    console.error('Erro inesperado:', err);
    res.status(500).json({
      success: false,
      message: 'Erro inesperado ao processar o registro do aluno.',
      errorDetails: err.message,
    });
  }
});

// Iniciar o servidor na porta 3000
const PORT = 'https://precenca-digital-back-end-2998-764x0u399.vercel.app/';
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});