// controllers/authController.js
import fetch from 'node-fetch'; // Para fazer requisições para a API do UniFOA

// Função para verificar o login do UniFOA
export const checkLoginStatus = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // O token JWT ou algum outro token enviado no cabeçalho
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token de autenticação não encontrado.' });
  }

  try {
    // Aqui você pode fazer uma requisição para a API de autenticação do UniFOA, passando o token
    const response = await fetch('https://www.unifoa.edu.br/logar/verify_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    // Se a resposta indicar que o token é válido, retorna a resposta
    if (data.success) {
      return res.status(200).json({ success: true, message: 'Usuário logado com sucesso!' });
    } else {
      return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro ao verificar o login. Tente novamente.' });
  }
};
