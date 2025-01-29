import express from 'express';
import cors from 'cors';
import supabase from './supabaseClient.js'; // Arquivo de configuração do Supabase

const app = express();

// Habilitar CORS para permitir o acesso a partir do frontend na Vercel
const corsOptions = {
  origin: '3000',  // Front-End hospedado na Vercel
  methods: 'GET, POST, PUT, DELETE',  // Métodos permitidos
  allowedHeaders: 'Content-Type, Authorization',  // Cabeçalhos permitidos
  credentials: true,  // Permite o envio de cookies, se necessário
};

app.use(cors(corsOptions));

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

  // Verificação simples para garantir que o nome e matrícula foram informados
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
    // Verificar se o aluno já existe no banco de dados (por nome ou matrícula)
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

    // Sucesso no registro
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

// Iniciar o servidor na porta correta para Vercel
const PORT = 3000; // Para rodar corretamente na Vercel
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
