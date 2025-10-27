const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db');
const authRouter = require('./router/authRouter');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
  console.log('✅ Quelqu\'un a visité /');
  res.json({ 
    message: '🍕 Backend Pizza Pete\'s FONCTIONNE !',
    status: 'OK'
  });
});

// Routes d'authentification
app.use('/api/auth', authRouter);

// Démarrer le serveur
const startServer = async () => {
  await connectDB();
  
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log('\n✨✨✨ SERVEUR DÉMARRÉ ✨✨✨');
    console.log(`📍 http://localhost:${PORT}`);
    console.log('==============================\n');
  });
};

startServer();