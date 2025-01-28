// saml/samlConfig.js
import passport from 'passport';
import { SamlStrategy as Strategy } from 'passport-saml';

passport.use(new Strategy({
  path: '/login/callback',  // Endpoint para callback de resposta da Unifoa
  entryPoint: 'https://login.microsoftonline.com/de30b897-eadd-4911-b7b1-2e8118c5093d/saml2',  // URL do SSO da Unifoa
  issuer: 'sua-aplicacao',  // Identificador da sua aplicação
  cert: process.env.UNIFOA_SAML_CERT,  // Certificado fornecido pela Unifoa
  privateCert: process.env.UNIFOA_SAML_PRIVATE_CERT, // Certificado privado, caso necessário
  decryptionPvk: process.env.UNIFOA_SAML_PRIVATE_KEY, // Certificado de chave privada (se necessário)
  validateInResponseTo: false,
  disableRequestedAuthnContext: true,
}, (profile, done) => {
  // Gerar o token JWT após a autenticação via Unifoa (SAML)
  const usuario = {
    id: profile.id,  // Usar o identificador único do usuário retornado
    nome: profile.name, // Nome do aluno
    matricula: profile.matricula, // Matrícula do aluno
  };

  done(null, usuario);
}));

// Serializar e desserializar o usuário no session (se necessário)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
