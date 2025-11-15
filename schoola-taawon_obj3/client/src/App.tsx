import React, { useState, useEffect } from 'react';

// Simple functional components without external dependencies
const Navbar = () => (
  React.createElement('header', {
    style: { backgroundColor: '#1976d2', color: 'white', padding: '16px' }
  }, React.createElement('h1', { style: { margin: 0 } }, 'Schoola-Taawon'))
);

const Home = () => (
  React.createElement('main', { style: { padding: '20px' } },
    React.createElement('h2', null, 'Accueil'),
    React.createElement('p', null, 'Plateforme de partage de connaissances éducatives')
  )
);

const Listings = () => (
  React.createElement('main', { style: { padding: '20px' } },
    React.createElement('h2', null, 'Annonces'),
    React.createElement('p', null, 'Liste des annonces disponibles')
  )
);

const Login = () => (
  React.createElement('main', { style: { padding: '20px' } },
    React.createElement('h2', null, 'Connexion'),
    React.createElement('button', {
      style: { padding: '10px 20px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px' }
    }, 'Se connecter')
  )
);

const Register = () => (
  React.createElement('main', { style: { padding: '20px' } },
    React.createElement('h2', null, 'Inscription'),
    React.createElement('button', {
      style: { padding: '10px 20px', backgroundColor: '#388e3c', color: 'white', border: 'none', borderRadius: '4px' }
    }, 'S\'inscrire')
  )
);

const Messages = () => (
  React.createElement('main', { style: { padding: '20px' } },
    React.createElement('h2', null, 'Messages'),
    React.createElement('p', null, 'Messagerie en temps réel')
  )
);

const CreateListing = () => (
  React.createElement('main', { style: { padding: '20px' } },
    React.createElement('h2', null, 'Créer une annonce'),
    React.createElement('p', null, 'Formulaire de création d\'annonce')
  )
);

// Simple routing without external libraries
const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return Home();
      case '/listings':
        return Listings();
      case '/login':
        return Login();
      case '/register':
        return Register();
      case '/create-listing':
        return CreateListing();
      case '/messages':
        return Messages();
      default:
        return Home();
    }
  };

  return React.createElement('div', null,
    Navbar(),
    React.createElement('nav', { style: { backgroundColor: '#f5f5f5', padding: '10px' } },
      React.createElement('button', { onClick: () => navigate('/'), style: { margin: '0 10px', padding: '5px 10px' } }, 'Accueil'),
      React.createElement('button', { onClick: () => navigate('/listings'), style: { margin: '0 10px', padding: '5px 10px' } }, 'Annonces'),
      React.createElement('button', { onClick: () => navigate('/login'), style: { margin: '0 10px', padding: '5px 10px' } }, 'Connexion'),
      React.createElement('button', { onClick: () => navigate('/register'), style: { margin: '0 10px', padding: '5px 10px' } }, 'Inscription'),
      React.createElement('button', { onClick: () => navigate('/create-listing'), style: { margin: '0 10px', padding: '5px 10px' } }, 'Créer Annonce'),
      React.createElement('button', { onClick: () => navigate('/messages'), style: { margin: '0 10px', padding: '5px 10px' } }, 'Messages')
    ),
    renderPage()
  );
};

export default App;
