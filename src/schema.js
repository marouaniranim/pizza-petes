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
    .required()
    .messages({
      'string.empty': 'L\'email est obligatoire',
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
    .required()
    .messages({
      'string.empty': 'Le mot de passe est obligatoire',
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères'
    })
});

// Schéma pour la connexion
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
const updateProfileSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Le prénom doit contenir au moins 2 caractères',
      'string.max': 'Le prénom ne peut pas dépasser 50 caractères'
    }),
  
  lastName: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 50 caractères'
    }),
  
  address: Joi.string()
    .min(5)
    .max(200)
    .messages({
      'string.min': 'L\'adresse doit contenir au moins 5 caractères'
    }),
  
  city: Joi.string()
    .min(2)
    .max(100)
    .messages({
      'string.min': 'La ville doit contenir au moins 2 caractères'
    }),
  
  state: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Le département/état doit contenir au moins 2 caractères'
    }),
  
  currentPassword: Joi.string()
    .min(6)
    .messages({
      'string.min': 'Le mot de passe actuel doit contenir au moins 6 caractères'
    }),
  
  newPassword: Joi.string()
    .min(6)
    .messages({
      'string.min': 'Le nouveau mot de passe doit contenir au moins 6 caractères'
    })
}).custom((value, helpers) => {
  if (value.newPassword && !value.currentPassword) {
    return helpers.error('any.custom', {
      message: 'Le mot de passe actuel est requis pour changer le mot de passe'
    });
  }
  return value;
});

// Middleware de validation
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true
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
  updateProfileSchema,
  validateRequest
};