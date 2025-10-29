const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est obligatoire'],
    trim: true,
    minlength: [2, 'Le prénom doit contenir au moins 2 caractères']
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères']
  },
  email: {
    type: String,
    required: function() {
      return this.isAdmin; // Email requis seulement pour les admins
    },
    unique: true,
    sparse: true, // Permet plusieurs documents sans email
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide'],
    default: null
  },
  address: {
    type: String,
    required: [true, 'L\'adresse est obligatoire'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'La ville est obligatoire'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'Le département/état est obligatoire'],
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return this.isAdmin; // Password requis seulement pour les admins
    },
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    default: null
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password avant sauvegarde (uniquement si modifié et si admin)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.isAdmin) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe (uniquement pour admin)
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.isAdmin) {
    throw new Error('Cette méthode est réservée aux administrateurs');
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Exclure le password lors de la sérialisation
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  if (user.password) {
    delete user.password;
  }
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;