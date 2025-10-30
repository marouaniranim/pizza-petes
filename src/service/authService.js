const authRepository = require('../repository/authRepository');
const { generateToken } = require('../config/jwt');

class AuthService {
  async register(req, res) {
    try {
      console.log('📝 Tentative d\'inscription avec:', req.body);

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
      console.log('🔐 Tentative de connexion avec:', req.body.email);

      const { email, password } = req.body;

      // Recherche de l'utilisateur
      const user = await authRepository.findByEmail(email);
      if (!user) {
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

      console.log('✅ UTILISATEUR CONNECTÉ:', user.email);

      return res.json({
        success: true,
        message: 'Connexion réussie ! 🎉',
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
      console.log('👤 Récupération du profil pour:', req.user.id);
      
      const user = await authRepository.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      console.log('✅ Profil récupéré:', user.email);

      return res.json({
        success: true,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address: user.address,
          city: user.city,
          state: user.state,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });

    } catch (error) {
      console.error('❌ Erreur getProfile:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil'
      });
    }
  }

  async updateProfile(req, res) {
    try {
      console.log('✏️ Mise à jour du profil pour:', req.user.id);
      console.log('📝 Données reçues:', req.body);

      const { firstName, lastName, address, city, state, currentPassword, newPassword } = req.body;

      // Récupérer l'utilisateur actuel
      const user = await authRepository.findByEmail(req.user.email);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Si l'utilisateur veut changer son mot de passe
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({
            success: false,
            message: 'Le mot de passe actuel est requis pour changer le mot de passe'
          });
        }

        // Vérifier le mot de passe actuel
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Mot de passe actuel incorrect'
          });
        }

        // Mettre à jour le mot de passe
        user.password = newPassword;
      }

      // Mettre à jour les autres champs si fournis
      if (firstName) user.firstName = firstName.trim();
      if (lastName) user.lastName = lastName.trim();
      if (address) user.address = address.trim();
      if (city) user.city = city.trim();
      if (state) user.state = state.trim();

      // Sauvegarder les modifications
      await user.save();

      console.log('✅ Profil mis à jour avec succès:', user.email);

      return res.json({
        success: true,
        message: 'Profil mis à jour avec succès ! 🎉',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address: user.address,
          city: user.city,
          state: user.state,
          isAdmin: user.isAdmin,
          updatedAt: user.updatedAt
        }
      });

    } catch (error) {
      console.error('❌ Erreur updateProfile:', error);
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: messages.join(', ')
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du profil'
      });
    }
  }
}

module.exports = new AuthService();