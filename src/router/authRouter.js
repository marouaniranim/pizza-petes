const express = require('express');
const authService = require('../service/authService');
const { registerSchema, loginSchema, validateRequest } = require('../schema');

const router = express.Router();

// Route pour l'inscription avec validation
router.post('/register', validateRequest(registerSchema), (req, res) => authService.register(req, res));

// Route pour la connexion avec validation
router.post('/login', validateRequest(loginSchema), (req, res) => authService.login(req, res));

// Route pour voir tous les utilisateurs
router.get('/users', (req, res) => authService.getUsers(req, res));

// Route pour récupérer le profil utilisateur
router.get('/profile', (req, res) => authService.getProfile(req, res));

module.exports = router;