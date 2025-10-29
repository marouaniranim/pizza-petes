const authRepository = require('../repository/authRepository');
const { generateToken } = require('../config/jwt');

class AuthService {
  async register(req, res) {
    try {
      console.log('📝 Tentative d\'inscription avec:', req.body);

<<<<<<< HEAD
      const { firstName, lastName, email, address, city, state, password, isAdmin } = req.body;

      // Vérification si l'utilisateur admin existe déjà (par email)
      if (isAdmin && email) {
        const existingAdmin = await authRepository.findByEmail(email);
        if (existingAdmin) {
          return res.status(409).json({
            success: false,
            message: 'Un administrateur avec cet email existe déjà'
          });
        }
      }

      // Préparation des données utilisateur
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        isAdmin: isAdmin || false
      };

      // Ajout des champs admin si nécessaire
      if (isAdmin) {
        userData.email = email.toLowerCase().trim();
        userData.password = password;
      }

      // Création de l'utilisateur
      const user = await authRepository.create(userData);

      // Génération du token uniquement pour les admins
      let token = null;
      if (user.isAdmin) {
        token = generateToken(user._id);
      }

      console.log('🎉 NOUVEL UTILISATEUR INSCRIT:');
      console.log('👤 Nom:', user.firstName, user.lastName);
      console.log('🆔 ID:', user._id);
      console.log('👑 Admin:', user.isAdmin);
      if (user.isAdmin) {
        console.log('📧 Email:', user.email);
      }

      const response = {
        success: true,
        message: user.isAdmin ? 
          'Administrateur créé avec succès ! 🎉' : 
          'Utilisateur créé avec succès ! 🎉',
=======
      const { firstName, lastName, email, address, city, state, password } = req.body;

      // Vérification si l'utilisateur existe déjà
      const existingUser = await authRepository.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà'
        });
      }

      // Création de l'utilisateur
      const user = await authRepository.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        password: password
      });

      // Génération du token
      const token = generateToken(user._id);

      console.log('🎉 NOUVEL UTILISATEUR INSCRIT:');
      console.log('📧 Email:', user.email);
      console.log('👤 Nom:', user.firstName, user.lastName);
      console.log('🆔 ID:', user._id);

      return res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès ! 🎉',
>>>>>>> 7c7574c74a032b5aba05ecb0532be9a9259156be
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
<<<<<<< HEAD
=======
          email: user.email,
>>>>>>> 7c7574c74a032b5aba05ecb0532be9a9259156be
          address: user.address,
          city: user.city,
          state: user.state,
          isAdmin: user.isAdmin
<<<<<<< HEAD
        }
      };

      // Ajout de l'email et du token seulement pour les admins
      if (user.isAdmin) {
        response.user.email = user.email;
        response.token = token;
      }

      return res.status(201).json(response);
=======
        },
        token: token
      });
>>>>>>> 7c7574c74a032b5aba05ecb0532be9a9259156be

    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error);
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: messages.join(', ')
        });
      }
      
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de l\'inscription'
      });
    }
  }

  async login(req, res) {
    try {
<<<<<<< HEAD
      console.log('🔐 Tentative de connexion admin avec:', req.body.email);

      const { email, password } = req.body;

      // Recherche de l'administrateur
      const user = await authRepository.findByEmail(email);
      if (!user || !user.isAdmin) {
=======
      console.log('🔐 Tentative de connexion avec:', req.body.email);

      const { email, password } = req.body;

      // Recherche de l'utilisateur
      const user = await authRepository.findByEmail(email);
      if (!user) {
>>>>>>> 7c7574c74a032b5aba05ecb0532be9a9259156be
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Vérification du mot de passe
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Génération du token
      const token = generateToken(user._id);

<<<<<<< HEAD
      console.log('✅ ADMINISTRATEUR CONNECTÉ:', user.email);

      return res.json({
        success: true,
        message: 'Connexion administrateur réussie ! 🎉',
=======
      console.log('✅ UTILISATEUR CONNECTÉ:', user.email);

      return res.json({
        success: true,
        message: 'Connexion réussie ! 🎉',
>>>>>>> 7c7574c74a032b5aba05ecb0532be9a9259156be
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address: user.address,
          city: user.city,
          state: user.state,
          isAdmin: user.isAdmin
        },
        token: token
      });

    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la connexion'
      });
    }
  }

  async getUsers(req, res) {
    try {
      console.log('👥 Requête pour voir tous les utilisateurs');
      
      const users = await authRepository.findAll();
      
      console.log(`✅ ${users.length} utilisateurs trouvés`);
      
      return res.json({
        success: true,
        count: users.length,
        users: users
      });

    } catch (error) {
      console.error('❌ Erreur getUsers:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs'
      });
    }
  }

  async getProfile(req, res) {
    try {
      // Note: Vous devrez implémenter le middleware d'authentification pour avoir req.user
      const user = await authRepository.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      return res.json({
        success: true,
        user: user
      });

    } catch (error) {
      console.error('❌ Erreur getProfile:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil'
      });
    }
  }
}

module.exports = new AuthService();