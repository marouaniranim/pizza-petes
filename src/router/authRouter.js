const express = require('express');
const authService = require('../service/authService');
const { registerSchema, loginSchema, validateRequest, validateAdminFields } = require('../schema/validationSchema');

const router = express.Router();

// Route pour l'inscription avec validation
router.post('/register', 
  validateRequest(registerSchema), 
  validateAdminFields, 
  (req, res) => authService.register(req, res)
);

// Route pour la connexion (admin seulement)
router.post('/login', validateRequest(loginSchema), (req, res) => authService.login(req, res));

// Route pour voir tous les utilisateurs
router.get('/users', (req, res) => authService.getUsers(req, res));

// Route pour récupérer le profil utilisateur
router.get('/profile', (req, res) => authService.getProfile(req, res));

module.exports = router;