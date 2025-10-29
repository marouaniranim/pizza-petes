const Joi = require('joi');

// Schéma pour l'inscription
const registerSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Le prénom est obligatoire',
      'string.min': 'Le prénom doit contenir au moins 2 caractères',
      'string.max': 'Le prénom ne peut pas dépasser 50 caractères'
    }),
  
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Le nom est obligatoire',
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 50 caractères'
    }),
  
  email: Joi.string()
    .email()
    .optional()
    .allow('', null)
    .messages({
      'string.email': 'Format d\'email invalide'
    }),
  
  address: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.empty': 'L\'adresse est obligatoire',
      'string.min': 'L\'adresse doit contenir au moins 5 caractères'
    }),
  
  city: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'La ville est obligatoire',
      'string.min': 'La ville doit contenir au moins 2 caractères'
    }),
  
  state: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Le département/état est obligatoire',
      'string.min': 'Le département/état doit contenir au moins 2 caractères'
    }),
  
  password: Joi.string()
    .min(6)
    .optional()
    .allow('', null)
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères'
    }),
  
  isAdmin: Joi.boolean()
    .default(false)
});

// Schéma pour la connexion (uniquement pour admin)
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'L\'email est obligatoire',
      'string.email': 'Format d\'email invalide'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Le mot de passe est obligatoire'
    })
});

// Validation conditionnelle pour les admins
const validateAdminFields = (req, res, next) => {
  const { isAdmin, email, password } = req.body;
  
  if (isAdmin) {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Pour un compte administrateur, l\'email et le mot de passe sont obligatoires'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe administrateur doit contenir au moins 6 caractères'
      });
    }
  }
  
  next();
};

// Middleware de validation
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: true
    });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errorMessages
      });
    }
    
    req.body = value;
    next();
  };
};

module.exports = {
  registerSchema,
  loginSchema,
  validateRequest,
  validateAdminFields
};