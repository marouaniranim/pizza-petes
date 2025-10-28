import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const BACKEND_URL = 'http://localhost:5001';
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setIsError(false);
        setMessage('✅ Compte créé avec succès ! Redirection...');
        
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          address: '',
          city: '',
          state: '',
          password: ''
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setTimeout(() => {
          alert(`Bienvenue ${data.user.firstName} ! 🍕`);
        }, 1500);
        
      } else {
        setIsError(true);
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setIsError(true);
      setMessage('❌ Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Overlay flou */}
      <div className="background-overlay"></div>
      
      <div className="register-form">
        <div className="form-header">
          <div className="logo">
            <span className="pizza-icon">🍕</span>
            <h1>Pizza Pete's</h1>
          </div>
          <h2>Rejoignez la famille Pizza Pete's</h2>
          <p>Créez votre compte pour commander vos pizzas préférées</p>
        </div>
        
        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="animated-form">
          <div className="form-row">
            <div className="form-group">
              <label>Prénom</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Votre prénom"
              />
            </div>
            
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Adresse email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="exemple@email.com"
            />
          </div>

          <div className="form-group">
            <label>Adresse de livraison</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Votre adresse complète"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ville</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Votre ville"
              />
            </div>
            
            <div className="form-group">
              <label>Etat</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Votre Etat"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Au moins 6 caractères"
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Création en cours...
              </>
            ) : (
              '🍕 Créer mon compte'
            )}
          </button>
        </form>

        <div className="form-footer">
          <p>Vous avez déjà un compte ? <a href="/login" className="login-link">Se connecter</a></p>
          <div className="security-note">
            <small>🔒 Vos données sont sécurisées</small>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;